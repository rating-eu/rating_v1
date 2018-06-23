import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {AttackStrategyMgm} from '../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import {AttackStrategyMgmService} from '../entities/attack-strategy-mgm/attack-strategy-mgm.service';
import {Principal} from '../shared';
import {LevelMgm, LevelMgmService} from '../entities/level-mgm';
import {PhaseMgm, PhaseMgmService} from '../entities/phase-mgm';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {isUndefined} from 'util';
import {ThreatAgentMgm} from '../entities/threat-agent-mgm';
import {DatasharingService} from '../datasharing/datasharing.service';
import {QuestionMgm} from '../entities/question-mgm';
import {AnswerMgm} from '../entities/answer-mgm';
import {QuestionType} from '../entities/enumerations/QuestionType.enum';
import {AnswerLikelihood} from '../entities/enumerations/AnswerLikelihood.enum';
import {AttackStrategyLikelihood} from '../entities/enumerations/AttackStrategyLikelihood.enum';
import {Couple} from '../utils/couple.class';
import {SkillLevel} from '../entities/enumerations/SkillLevel.enum';
import {Frequency} from '../entities/enumerations/Frequency.enum';
import {ResourceLevel} from '../entities/enumerations/ResourceLevel.enum';
import {AnswerWeightMgm, AnswerWeightMgmService} from '../entities/answer-weight-mgm';
import {AugmentedAttackStrategy} from './models/augmented-attack-strategy.model';
import {AttackStrategyUpdate} from './models/attack-strategy-update.model';

@Component({
    selector: 'jhi-evaluate-weakness',
    templateUrl: './evaluate-weakness.component.html',
    styleUrls: [
        './evaluate-weakness.css'
    ]
})
export class EvaluateWeaknessComponent implements OnInit, OnDestroy {
    attackStrategies: AttackStrategyMgm[];
    /**
     * Map used to update the likelihoods of each AttackStrategy in time O(1).
     */
    augmentedAttackStrategiesMap: Map<number/*AttackStrategy ID*/, AugmentedAttackStrategy/*AttackStrategy likelihoods*/>;
    attackLayers: LevelMgm[];
    cyberKillChainPhases: PhaseMgm[];
    attacksCKC7Matrix: AugmentedAttackStrategy[][][];
    threatAgentAttackPossible: boolean[][];

    account: Account;
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    selectedSelfAssessment: SelfAssessmentMgm = {};
    selectedThreatAgent: ThreatAgentMgm;
    answerWeights: AnswerWeightMgm[];
    answerWeightMap: Map<number/*QuestionType*/, Map<number/*AnswerLikelihood*/, number/*AnswerWeight*/>>;

    constructor(private attackStrategyService: AttackStrategyMgmService,
                private jhiAlertService: JhiAlertService,
                private eventManager: JhiEventManager,
                private activatedRoute: ActivatedRoute,
                private principal: Principal,
                private mySelfAssessmentService: SelfAssessmentMgmService,
                private levelService: LevelMgmService,
                private phaseService: PhaseMgmService,
                private dataSharingService: DatasharingService,
                private answerWeightService: AnswerWeightMgmService) {
    }

    ngOnInit() {
        console.log('Evaluate weakness onInit');
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.selectedSelfAssessment = this.mySelfAssessmentService.getSelfAssessment();
        this.registerChangeInEvaluateWeakness();

        const observables: Observable<HttpResponse<any>>[] = [];
        observables.push(this.levelService.query());
        observables.push(this.phaseService.query());
        observables.push(this.attackStrategyService.query());
        observables.push(this.answerWeightService.query());

        forkJoin(observables).toPromise()
            .then((responses: HttpResponse<any>[]) => {
                responses.forEach((value: HttpResponse<any>, index: Number, array: HttpResponse<any>[]) => {
                    switch (index) {
                        case 0: {// attack-layers
                            this.attackLayers = value.body as LevelMgm[];
                            break;
                        }
                        case 1: {// ckc7-phases
                            this.cyberKillChainPhases = value.body as PhaseMgm[];
                            break;
                        }
                        case 2: {// attack-strategies
                            this.attackStrategies = value.body as AttackStrategyMgm[];
                            this.augmentedAttackStrategiesMap = new Map<number, AugmentedAttackStrategy>();

                            this.attackStrategies.forEach((attackStrategy: AttackStrategyMgm) => {
                                const augmentedAttackStrategy: AugmentedAttackStrategy = new AugmentedAttackStrategy(attackStrategy);
                                augmentedAttackStrategy.initialLikelihood = this.attackStrategyInitialLikelihood(attackStrategy);

                                this.augmentedAttackStrategiesMap.set(attackStrategy.id, augmentedAttackStrategy);
                            });
                            break;
                        }
                        case 3: {
                            this.answerWeights = value.body as AnswerWeightMgm[];
                            this.answerWeightMap = new Map<number, Map<number, number>>();

                            this.answerWeights.forEach((answerWeight: AnswerWeightMgm) => {
                                const questionType: QuestionType = answerWeight.questionType;
                                const questionTypeValue: number = Number(QuestionType[questionType]);
                                console.log('QuestionType: ' + questionType);
                                console.log('QuestionType value: ' + questionTypeValue);

                                const answerLikelihood: AnswerLikelihood = answerWeight.likelihood;
                                const answerLikelihoodValue: number = Number(AnswerLikelihood[answerLikelihood]);
                                console.log('AnswerLikelihood: ' + answerLikelihood);
                                console.log('AnswerLikelihood value: ' + answerLikelihoodValue);

                                const weight: number = answerWeight.weight;
                                console.log('Weight: ' + weight);

                                if (this.answerWeightMap.has(questionTypeValue)) {// REGULAR, RELEVANT
                                    // LOW, LOW_MEDIUM, MEDIUM, MEDIUM_HIGH, HIGH
                                    this.answerWeightMap.get(questionTypeValue).set(answerLikelihoodValue, weight);
                                } else {
                                    // REGULAR, RELEVANT
                                    this.answerWeightMap.set(questionTypeValue, new Map<number, number>());
                                    // LOW, LOW_MEDIUM, MEDIUM, MEDIUM_HIGH, HIGH
                                    this.answerWeightMap.get(questionTypeValue).set(answerLikelihoodValue, weight);
                                }
                            });

                            break;
                        }
                    }
                });

                this.attacksCKC7Matrix = [];

                this.augmentedAttackStrategiesMap.forEach((augmentedAttackStrategy: AugmentedAttackStrategy, attackStrategyID: number) => {
                    const attackStrategy: AttackStrategyMgm = augmentedAttackStrategy.attackStrategy;
                    const attackStrategyLevels: LevelMgm[] = attackStrategy.levels;
                    const attackStrategyPhases: PhaseMgm[] = attackStrategy.phases;

                    attackStrategyLevels.forEach((level: LevelMgm) => {
                        if (isUndefined(this.attacksCKC7Matrix[level.id])) {
                            this.attacksCKC7Matrix[level.id] = [];
                        }

                        attackStrategyPhases.forEach((phase: PhaseMgm) => {
                            if (isUndefined(this.attacksCKC7Matrix[level.id][phase.id])) {
                                this.attacksCKC7Matrix[level.id][phase.id] = [];
                            }

                            this.attacksCKC7Matrix[level.id][phase.id].push(augmentedAttackStrategy);
                        });
                    });
                });

                console.log('CKC7 matrix...');
                console.log(JSON.stringify(this.attacksCKC7Matrix));

                console.log('HUMAN-RECONNAISSANCE');
                console.log(JSON.stringify(this.attacksCKC7Matrix[1][1]));

                this.threatAgentAttackPossible = [];
                const threatAgents = this.selectedSelfAssessment.threatagents;

                threatAgents.forEach((threatAgent) => {
                    this.threatAgentAttackPossible[threatAgent.id] = [];

                    this.attackStrategies.forEach((attackStrategy) => {
                        this.threatAgentAttackPossible[threatAgent.id][attackStrategy.id] = this.isAttackPossible(threatAgent.skillLevel, attackStrategy.skill);
                    });
                });
            });

        // Observe changes for single AttackStrategy
        this.dataSharingService.attackStrategyUpdate$.subscribe(
            (attackStrategyUpdate: AttackStrategyUpdate) => {
                if (attackStrategyUpdate !== undefined) {
                    console.log('AttackStrategy update: ' + JSON.stringify(attackStrategyUpdate));
                    console.log('Answers size: ' + attackStrategyUpdate.questionsAnswerMap.size);

                    // TODO update the AnswersLikelihood and ContextualLikelihood of the AttackStrategy
                    const augmentedAttackStrategy: AugmentedAttackStrategy = this.augmentedAttackStrategiesMap.get(attackStrategyUpdate.id);
                    augmentedAttackStrategy.cisoAnswersLikelihoodNumber = this.attackStrategyAnswersLikelihood(attackStrategyUpdate);
                    augmentedAttackStrategy.cisoAnswersLikelihood = this.numberToAttackStrategyLikelihood(this.attackStrategyAnswersLikelihood(attackStrategyUpdate));

                    augmentedAttackStrategy.contextualLikelihoodNumber = this.attackStrategyContextualLikelihood(augmentedAttackStrategy.initialLikelihoodNumber, augmentedAttackStrategy.cisoAnswersLikelihoodNumber);
                    augmentedAttackStrategy.contextualLikelihood = this.numberToAttackStrategyLikelihood(augmentedAttackStrategy.contextualLikelihoodNumber);

                    augmentedAttackStrategy.updateCssClass();
                }
            }
        );
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackByID(index: number, item: AugmentedAttackStrategy) {
        return item.id;
    }

    registerChangeInEvaluateWeakness() {
        this.eventSubscriber = this.eventManager.subscribe('WeaknessListModification', (response) => this.ngOnInit());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    threatAgentChanged(threatAgent: ThreatAgentMgm) {
        console.log('ThreatAgent Changed: ' + JSON.stringify(threatAgent));
        // Update the enabled status of each AttackStrategy depending on the Skills of
        // the ThreatAgent and the Skills required to perform the attack.
        this.augmentedAttackStrategiesMap.forEach((augmentedAttackStrategy: AugmentedAttackStrategy) => {
            const attackStrategy: AttackStrategyMgm = augmentedAttackStrategy.attackStrategy;
            console.log('AttackStrategy: ' + JSON.stringify(attackStrategy));

            // Check if the ThreatAgent is defined or not
            if (threatAgent) {
                augmentedAttackStrategy.enabled = this.isAttackPossible(threatAgent.skillLevel, attackStrategy.skill);
            } else {
                augmentedAttackStrategy.enabled = false;
            }

            console.log('Enabled: ' + augmentedAttackStrategy.enabled);
            // Update the CSS class of the AttackStrategy
            augmentedAttackStrategy.updateCssClass();
        });
    }

    isAttackPossible(threatAgentSkills: SkillLevel, attackStrategyDifficulty: SkillLevel): boolean {

        console.log('ENTER isAttackPossible...');

        console.log(threatAgentSkills); // String
        const threatAgentSkillsValue = SkillLevel[threatAgentSkills];
        console.log(threatAgentSkillsValue); // Number

        console.log(attackStrategyDifficulty); // String
        const attackStrategyDifficultyValue = SkillLevel[attackStrategyDifficulty];
        console.log(attackStrategyDifficultyValue); // Number

        return threatAgentSkillsValue >= attackStrategyDifficultyValue;
    }

    attackStrategyInitialLikelihood(attackStrategy: AttackStrategyMgm): AttackStrategyLikelihood {
        const frequencyValue = Number(Frequency[attackStrategy.frequency]);
        const resourcesValue = Number(ResourceLevel[attackStrategy.resources]);

        const attackStrategyInitialLikelihoodMatrix: {} = {
            1: {
                3: AttackStrategyLikelihood.LOW,
                2: AttackStrategyLikelihood.LOW_MEDIUM,
                1: AttackStrategyLikelihood.MEDIUM
            },
            2: {
                3: AttackStrategyLikelihood.LOW_MEDIUM,
                2: AttackStrategyLikelihood.MEDIUM,
                1: AttackStrategyLikelihood.MEDIUM_HIGH
            },
            3: {
                3: AttackStrategyLikelihood.MEDIUM,
                2: AttackStrategyLikelihood.MEDIUM_HIGH,
                1: AttackStrategyLikelihood.HIGH
            }
        };

        console.log('Matrix:');
        console.log(JSON.stringify(attackStrategyInitialLikelihoodMatrix));

        // Reducing matrix index by one, since it's zero-based
        const likelihood: AttackStrategyLikelihood = attackStrategyInitialLikelihoodMatrix[frequencyValue][resourcesValue];
        console.log('Likelihood: ' + likelihood);

        return likelihood;
    }

    attackStrategyAnswersLikelihood(attackStrategyUpdate: AttackStrategyUpdate) {

        if (attackStrategyUpdate) {
            let numerator = 0;
            let denominator = 0;

            if (attackStrategyUpdate.questionsAnswerMap) {
                const questionAnswersMap: Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>> = attackStrategyUpdate.questionsAnswerMap;

                questionAnswersMap.forEach((value: Couple<QuestionMgm, AnswerMgm>, key: Number) => {
                    const question: QuestionMgm = value.key;
                    const answer: AnswerMgm = value.value;
                    const answerLikelihoodValue: number = Number(AnswerLikelihood[answer.likelihood]);

                    const answerWeight: number = this.getAnswerWeight(question, answer);

                    numerator += answerWeight * answerLikelihoodValue;
                    denominator += answerWeight;
                });
            }

            if (denominator !== 0) {
                return numerator / denominator;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    attackStrategyContextualLikelihood(initialLikelihood: number, answersLikelihood: number) {
        return (initialLikelihood + answersLikelihood) / 2;
    }

    numberToAttackStrategyLikelihood(likelihoodNumber: number): AttackStrategyLikelihood {
        // Round it to the nearest integer value
        const integerLikelihood: number = Math.round(likelihoodNumber);
        console.log('Integer LikelihoodNumber: ' + integerLikelihood);

        // Get the corresponding Likelihood enum entry
        const likelihood: AttackStrategyLikelihood = AttackStrategyLikelihood[AttackStrategyLikelihood[integerLikelihood]];
        console.log('Likelihood enum: ' + likelihood);

        return likelihood;
    }

    getAnswerWeight(question: QuestionMgm, answer: AnswerMgm): number {
        const questionTypeValue: number = Number(QuestionType[question.questionType]);
        const answerLikelihoodValue: number = Number(AnswerLikelihood[answer.likelihood]);

        if (this.answerWeightMap) {
            if (this.answerWeightMap.has(questionTypeValue)) {
                const map: Map<number, number> = this.answerWeightMap.get(questionTypeValue);

                if (map.has(answerLikelihoodValue)) {
                    return map.get(answerLikelihoodValue);
                }
            }
        }

        return 0;
    }
}
