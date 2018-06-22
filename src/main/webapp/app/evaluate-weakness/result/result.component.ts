import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {QuestionnaireStatusMgmService} from '../../entities/questionnaire-status-mgm';
import {HttpResponse} from '@angular/common/http';
import {QuestionnaireStatusMgm} from '../../entities/questionnaire-status-mgm/questionnaire-status-mgm.model';
import {Observable} from 'rxjs/Observable';
import {MyAnswerMgm, MyAnswerMgmService} from '../../entities/my-answer-mgm';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {PhaseMgm, PhaseMgmService} from '../../entities/phase-mgm';
import {LevelMgm, LevelMgmService} from '../../entities/level-mgm';
import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import {AttackStrategyMgmService} from '../../entities/attack-strategy-mgm/attack-strategy-mgm.service';
import {AnswerWeightMgm, AnswerWeightMgmService} from '../../entities/answer-weight-mgm';
import {AnswerLikelihood} from '../../entities/enumerations/AnswerLikelihood.enum';
import {QuestionType} from '../../entities/enumerations/QuestionType.enum';
import {isUndefined} from 'util';
import {SkillLevel} from '../../entities/enumerations/SkillLevel.enum';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {AnswerMgm} from '../../entities/answer-mgm';
import {AttackStrategyLikelihood} from '../../entities/enumerations/AttackStrategyLikelihood.enum';
import {QuestionMgm, QuestionMgmService} from '../../entities/question-mgm';
import {Frequency} from '../../entities/enumerations/Frequency.enum';
import {Couple} from '../../utils/couple.class';
import {ResourceLevel} from '../../entities/enumerations/ResourceLevel.enum';
import {ThreatAgentMgm} from '../../entities/threat-agent-mgm';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class WeaknessResultComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    // Matrix ingredients
    attackLevels: LevelMgm[];
    cyberKillChainPhases: PhaseMgm[];
    attackStrategies: AttackStrategyMgm[];
    attacksCKC7Matrix: AttackStrategyMgm[][][];

    // Answers weight scale
    answerWeights: AnswerWeightMgm[];
    answerWeightMap: Map<number/*QuestionType*/, Map<number/*AnswerLikelihood*/, number/*AnswerWeight*/>>;

    // Threat-Agents skills against Attacks' difficulty
    threatAgentAttackPossible: boolean[]/*ThreatAgentID*/[]/*AttackStrategyID*/;

    // SelfAssessment
    selectedSelfAssessment: SelfAssessmentMgm;

    // ThreatAgents
    threatAgents: ThreatAgentMgm[];

    // QuestionnaireStatus
    questionnaireStatus: QuestionnaireStatusMgm;

    // MyNaswers
    myAnswers: MyAnswerMgm[];

    // Questions
    questions: QuestionMgm[];

    // AttackStrategy MyAnswers
    private attackStrategyQuestionAnswersMap: Map</*AttackStrategy.ID*/number, Couple<AttackStrategyMgm, Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>>>>;

    // current ThreatAgent
    selectedThreatAgent: ThreatAgentMgm;

    constructor(private route: ActivatedRoute,
                private selfAssessmentService: SelfAssessmentMgmService,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                private myAnswerService: MyAnswerMgmService,
                private questionService: QuestionMgmService,
                private levelService: LevelMgmService,
                private phaseService: PhaseMgmService,
                private attackStrategyService: AttackStrategyMgmService,
                private answerWeightService: AnswerWeightMgmService) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.route.params.subscribe(
                (params: Params) => {
                    const questionnaireStatusID: number = params['statusID'];
                    console.log('QuestionnaireStatusID: ' + questionnaireStatusID);

                    const getObservables: Observable<HttpResponse<any>>[] = [];
                    getObservables.push(this.questionnaireStatusService.find(questionnaireStatusID));
                    getObservables.push(this.myAnswerService.getAllByQuestionnaireStatusID(questionnaireStatusID));

                    forkJoin(getObservables).toPromise().then(
                        (responses: any[]) => {
                            responses.forEach((value, index, array) => {
                                switch (index) {
                                    case 0: {
                                        this.questionnaireStatus = (value as HttpResponse<QuestionnaireStatusMgm>).body;
                                        console.log('QuestionnaireStatus: ' + JSON.stringify(this.questionnaireStatus));
                                        this.selectedSelfAssessment = this.questionnaireStatus.selfAssessment;

                                        this.selfAssessmentService.find(this.questionnaireStatus.selfAssessment.id)
                                            .toPromise()
                                            .then((response: HttpResponse<SelfAssessmentMgm>) => {
                                                this.selectedSelfAssessment = response.body;
                                                this.threatAgents = this.selectedSelfAssessment.threatagents;
                                                console.log('ThreatAgents: ' + JSON.stringify(this.threatAgents));
                                            });

                                        break;
                                    }
                                    case 1: {
                                        this.myAnswers = (value as HttpResponse<MyAnswerMgm[]>).body;
                                        console.log('MyAnswers: ' + JSON.stringify(this.myAnswers));
                                        this.attackStrategyQuestionAnswersMap = this.myAnswersToAttackStrategyQuestionAnswersMap(this.myAnswers);
                                        break;
                                    }
                                }
                            });

                            const getObservables: Observable<HttpResponse<any>>[] = [];
                            getObservables.push(this.levelService.query());// AttackLevels
                            getObservables.push(this.phaseService.query());// AttckPhases
                            getObservables.push(this.attackStrategyService.query());// AttackStrategies
                            getObservables.push(this.answerWeightService.query());// AnswerWeights

                            forkJoin(getObservables).toPromise()
                                .then((responses: HttpResponse<any>[]) => {
                                    responses.forEach((value: HttpResponse<any>, index: Number, array: HttpResponse<any>[]) => {
                                        switch (index) {
                                            case 0: {// attack-layers
                                                this.attackLevels = value.body as LevelMgm[];
                                                break;
                                            }
                                            case 1: {// ckc7-phases
                                                this.cyberKillChainPhases = value.body as PhaseMgm[];
                                                break;
                                            }
                                            case 2: {// attack-strategies
                                                this.attackStrategies = value.body as AttackStrategyMgm[];
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

                                    this.attackStrategies.forEach(((attackStrategy: AttackStrategyMgm) => {
                                        attackStrategy.levels.forEach((level: LevelMgm) => {
                                            if (isUndefined(this.attacksCKC7Matrix[level.id])) {
                                                this.attacksCKC7Matrix[level.id] = [];
                                            }

                                            attackStrategy.phases.forEach((phase: PhaseMgm) => {
                                                if (isUndefined(this.attacksCKC7Matrix[level.id][phase.id])) {
                                                    this.attacksCKC7Matrix[level.id][phase.id] = [];
                                                }

                                                this.attacksCKC7Matrix[level.id][phase.id].push(attackStrategy);
                                            });
                                        });
                                    }));

                                    console.log('CKC7 matrix...');
                                    console.log(JSON.stringify(this.attacksCKC7Matrix));

                                    console.log('HUMAN-RECONNAISSANCE');
                                    console.log(JSON.stringify(this.attacksCKC7Matrix[1][1]));

                                    this.threatAgentAttackPossible = [];

                                    this.threatAgents.forEach((threatAgent) => {
                                        this.threatAgentAttackPossible[threatAgent.id] = [];

                                        this.attackStrategies.forEach((attackStrategy) => {
                                            this.threatAgentAttackPossible[threatAgent.id][attackStrategy.id] = this.isAttackPossible(threatAgent.skillLevel, attackStrategy.skill);
                                        });
                                    });
                                });
                        }
                    );
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    // ============HELPER METHODS===========
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

    attackStrategyAnswersLikelihood(attackStrategy: AttackStrategyMgm) {

        let numerator = 0;
        let denominator = 0;

        if (this.attackStrategyQuestionAnswersMap.has(attackStrategy.id)) {
            const questionAnswersMap: Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>> = this.attackStrategyQuestionAnswersMap.get(attackStrategy.id).value;

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
    }

    attackStrategyFinalLikelihood(initialLikelihood: number, answersLikelihood: number) {
        if (answersLikelihood > 0) {
            return Math.round((initialLikelihood + answersLikelihood) / 2);
        } else {
            return initialLikelihood;
        }
    }

    attackStrategyColorStyleClass(attackStrategy: AttackStrategyMgm): string {
        console.log('ENTER attackStrategy color style: ' + attackStrategy.name);

        // First check if the attack is possible for the selected ThreatAgent
        if (this.selectedThreatAgent) {
            if (this.threatAgentAttackPossible[this.selectedThreatAgent.id][attackStrategy.id]) {
                // Get the initial likelihood of the AttackStrategy
                const initialLikelihood: number = this.attackStrategyInitialLikelihood(attackStrategy).valueOf();
                console.log('Initial likelihood: ' + initialLikelihood);

                // Get the likelihood from the self-assessment answers.
                const answersLikelihood: number = this.attackStrategyAnswersLikelihood(attackStrategy);
                console.log('Answers likelihood: ' + answersLikelihood);

                // Do the average if the answersLikelihood is > 0
                const finalLikelihood: number = this.attackStrategyFinalLikelihood(initialLikelihood, answersLikelihood);
                console.log('Final likelihood: ' + finalLikelihood);

                // Round it to the nearest integer value
                const integerLikelihood: number = Math.round(finalLikelihood);
                console.log('IntegerLikelihood: ' + integerLikelihood);

                // Get the corresponding Likelihood enum entry
                const likelihood: AttackStrategyLikelihood = AttackStrategyLikelihood[AttackStrategyLikelihood[integerLikelihood]];
                console.log('Likelihood enum: ' + likelihood);

                switch (likelihood) {
                    case AttackStrategyLikelihood.LOW: {
                        return 'low';
                    }
                    case AttackStrategyLikelihood.LOW_MEDIUM: {
                        return 'low-medium';
                    }
                    case AttackStrategyLikelihood.MEDIUM: {
                        return 'medium';
                    }
                    case AttackStrategyLikelihood.MEDIUM_HIGH: {
                        return 'medium-high';
                    }
                    case AttackStrategyLikelihood.HIGH: {
                        return 'high';
                    }
                }
            }
        }

        // If all the above cases failed, the attack is not possible, hence we show it as disabled.
        return 'disabled';
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

    myAnswersToAttackStrategyQuestionAnswersMap(myAnswers: MyAnswerMgm[]): Map</*AttackStrategy.ID*/number, Couple<AttackStrategyMgm, Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>>>> {
        const map: Map</*AttackStrategy.ID*/number, Couple<AttackStrategyMgm, Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>>>> = new Map<number, Couple<AttackStrategyMgm, Map<number, Couple<QuestionMgm, AnswerMgm>>>>();

        myAnswers.forEach((myAnswer: MyAnswerMgm) => {
            let question: QuestionMgm = myAnswer.question;
            const answer: AnswerMgm = myAnswer.answer;
            let attackStrategies: AttackStrategyMgm[] = question.attackStrategies;

            // Need to get the question again from the DB 'cause the AttackStrategies are not fetched.
            // TODO look fo a way to avoid this.
            this.questionService.find(question.id)
                .toPromise()
                .then((response: HttpResponse<QuestionMgm>) => {
                    question = response.body;
                    attackStrategies = question.attackStrategies;

                    attackStrategies.forEach((attackStrategy: AttackStrategyMgm) => {
                        if (this.attackStrategyQuestionAnswersMap.has(attackStrategy.id)) {// AttackStrategy already added
                            // #1
                            const attackStrategyQuestionsCouple: Couple<AttackStrategyMgm, Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>>> = this.attackStrategyQuestionAnswersMap.get(attackStrategy.id);

                            // #2
                            const questionAnswersMap: Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>> = attackStrategyQuestionsCouple.value;

                            // #3
                            const questionAnswerCouple: Couple<QuestionMgm, AnswerMgm> = new Couple<QuestionMgm, AnswerMgm>(question, answer);

                            // #4
                            questionAnswersMap.set(question.id, questionAnswerCouple);
                        } else {
                            // #2
                            const questionAnswersMap: Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>> = new Map<number, Couple<QuestionMgm, AnswerMgm>>();

                            // #1
                            const attackStrategyQuestionsCouple: Couple<AttackStrategyMgm, Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>>> = new Couple<AttackStrategyMgm, Map<number, Couple<QuestionMgm, AnswerMgm>>>(attackStrategy, questionAnswersMap);

                            // #3
                            const questionAnswerCouple: Couple<QuestionMgm, AnswerMgm> = new Couple<QuestionMgm, AnswerMgm>(question, answer);

                            // #4
                            questionAnswersMap.set(question.id, questionAnswerCouple);

                            // #5
                            this.attackStrategyQuestionAnswersMap.set(attackStrategy.id, attackStrategyQuestionsCouple);
                        }
                    });
                });
        });

        console.log('AttackStrategyQuestionAnswersMap size: ' + map.size);

        return map;
    }

    threatAgentChanged(threatAgent: ThreatAgentMgm) {
        console.log('ThreatAgent Changed: ' + threatAgent.name);
    }
}
