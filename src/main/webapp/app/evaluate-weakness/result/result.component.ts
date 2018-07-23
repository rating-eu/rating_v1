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
import {QuestionnaireMgm, QuestionnaireMgmService} from '../../entities/questionnaire-mgm';
import {AugmentedAttackStrategy} from '../models/augmented-attack-strategy.model';
import {mergeMap} from 'rxjs/operators';
import {WeaknessUtils} from '../utils/weakness-utils';
import {AttackStrategyUpdate} from '../models/attack-strategy-update.model';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styleUrls: [
        '.././evaluate-weakness.css'
    ]
})
export class WeaknessResultComponent implements OnInit, OnDestroy {
    private _subscriptions: Subscription[] = [];
    debug = false;

    questionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>>;
    questionnaireStatus: QuestionnaireStatusMgm;

    questionnaire: QuestionnaireMgm;

    myAnswers$: Observable<HttpResponse<MyAnswerMgm[]>>;
    myAnswers: MyAnswerMgm[];
    myAnswersByAttackStrategyMap: Map<number/*AttackStrategy ID*/, MyAnswerMgm[]>;

    questions$: Observable<HttpResponse<QuestionMgm[]>>;
    questions: QuestionMgm[];
    questionsMap: Map<number, QuestionMgm>;

    answerWeights$: Observable<HttpResponse<AnswerWeightMgm[]>>;
    answerWeights: AnswerWeightMgm[];
    answerWeightMap: Map<number/*QuestionType*/, Map<number/*AnswerLikelihood*/, number/*AnswerWeight*/>>;


    selfAssessment$: Observable<HttpResponse<SelfAssessmentMgm>>;
    selfAssessment: SelfAssessmentMgm;

    // ThreatAgents
    threatAgents: ThreatAgentMgm[];
    selectedThreatAgent: ThreatAgentMgm;

    // CyberKillChain7 Phases
    ckc7Phases$: Observable<HttpResponse<PhaseMgm[]>>;
    ckc7Phases: PhaseMgm[];

    // Attack Levels
    attackLevels$: Observable<HttpResponse<LevelMgm[]>>;
    attackLevels: LevelMgm[];

    // AttackStrategies
    attackStrategies$: Observable<HttpResponse<AttackStrategyMgm[]>>;
    attackStrategies: AttackStrategyMgm[];
    /**
     * Map used to update the likelihoods of each AttackStrategy in time O(1).
     */
    augmentedAttackStrategiesMap: Map<number/*AttackStrategy ID*/, AugmentedAttackStrategy/*AttackStrategy likelihoods*/>;

    // Attack Plan Matrix
    attacksCKC7Matrix: AugmentedAttackStrategy[/*Level*/][/*Phase*/][/*AugmentedAttackStrategy*/];


    constructor(private route: ActivatedRoute,
                private selfAssessmentService: SelfAssessmentMgmService,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                private myAnswerService: MyAnswerMgmService,
                private questionService: QuestionMgmService,
                private questionnaireService: QuestionnaireMgmService,
                private levelService: LevelMgmService,
                private phaseService: PhaseMgmService,
                private attackStrategyService: AttackStrategyMgmService,
                private answerWeightService: AnswerWeightMgmService) {
    }

    ngOnInit() {
        this.route
            .params
            .map(params => params['statusID'])
            .switchMap(// #0 --> read the QuestionnaireStatus ID
                (statusID: number) => {
                    console.log('QuestionnaireStatusID: ' + statusID);

                    this.questionnaireStatus$ = this.questionnaireStatusService.find(statusID);
                    this.ckc7Phases$ = this.phaseService.query();
                    this.attackLevels$ = this.levelService.query();
                    this.attackStrategies$ = this.attackStrategyService.query();
                    this.answerWeights$ = this.answerWeightService.query();

                    return forkJoin(
                        this.questionnaireStatus$,
                        this.ckc7Phases$,
                        this.attackLevels$,
                        this.attackStrategies$,
                        this.answerWeights$
                    );
                })
            .switchMap(// #1 --> fetch the QuestionnaireStatus, Phases, Levels, AttackStrategies
                (response:
                     [HttpResponse<QuestionnaireStatusMgm>, HttpResponse<PhaseMgm[]>, HttpResponse<LevelMgm[]>,
                         HttpResponse<AttackStrategyMgm[]>, HttpResponse<AnswerWeightMgm[]>]) => {

                    this.questionnaireStatus = response[0].body;
                    console.log('QuestionnaireStatus: ' + JSON.stringify(this.questionnaireStatus));

                    this.questionnaire = this.questionnaireStatus.questionnaire;
                    console.log('Questionnaire: ' + JSON.stringify(this.questionnaire));

                    this.ckc7Phases = response[1].body;
                    console.log('Phases: ' + JSON.stringify(this.ckc7Phases));

                    this.attackLevels = response[2].body;
                    console.log('Levels: ' + JSON.stringify(this.attackLevels));

                    this.attackStrategies = response[3].body;
                    console.log('AttackStrategies: ' + JSON.stringify(this.attackStrategies));

                    this.augmentedAttackStrategiesMap = new Map<number/*AttackStrategy ID*/, AugmentedAttackStrategy>();
                    this.attackStrategies.forEach((attackStrategy: AttackStrategyMgm) => {
                        const augmentedAttackStrategy: AugmentedAttackStrategy = new AugmentedAttackStrategy(attackStrategy);


                        this.augmentedAttackStrategiesMap.set(attackStrategy.id, augmentedAttackStrategy);
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

                    this.answerWeights = response[4].body;
                    console.log('AnswerWeights: ' + JSON.stringify(this.answerWeights));
                    this.answerWeightMap = WeaknessUtils.answerWeightsToMap(this.answerWeights);

                    this.myAnswers$ = this.myAnswerService.getAllByQuestionnaireStatusID(this.questionnaireStatus.id);
                    this.questions$ = this.questionService.getQuestionsByQuestionnaire(this.questionnaire.id);
                    this.selfAssessment$ = this.selfAssessmentService.find(this.questionnaireStatus.selfAssessment.id);

                    return forkJoin(this.myAnswers$, this.questions$, this.selfAssessment$);
                })
            .subscribe(
                (joinResponse: [HttpResponse<MyAnswerMgm[]>, HttpResponse<QuestionMgm[]>, HttpResponse<SelfAssessmentMgm>]) => {// #2 --> fetch MyAnswers and Questions
                    this.myAnswers = joinResponse[0].body;
                    console.log('MyAnswers: ' + JSON.stringify(this.myAnswers));

                    this.questions = joinResponse[1].body;
                    console.log('Questions: ' + JSON.stringify(this.questions));
                    this.questionsMap = new Map<number, QuestionMgm>();

                    this.questions.forEach((question: QuestionMgm) => {
                        this.questionsMap.set(question.id, question);
                    });
                    console.log('QuestionsMap size: ' + this.questionsMap.size);

                    this.myAnswersByAttackStrategyMap = new Map<number/*AttackStrategyID*/, MyAnswerMgm[]>();

                    this.myAnswers.forEach((myAnswer: MyAnswerMgm) => {
                        const question: QuestionMgm = this.questionsMap.get(myAnswer.question.id);
                        myAnswer.question = question;

                        question.attackStrategies.forEach((attackStrategy: AttackStrategyMgm) => {
                            const attackStrategyID: number = attackStrategy.id;

                            if (this.myAnswersByAttackStrategyMap.has(attackStrategyID)) {
                                const myAnswers: MyAnswerMgm[] = this.myAnswersByAttackStrategyMap.get(attackStrategyID);
                                myAnswers.push(myAnswer);
                            } else {
                                this.myAnswersByAttackStrategyMap.set(attackStrategyID, [myAnswer]);
                            }
                        });
                    });

                    this.myAnswersByAttackStrategyMap.forEach((myAnswers: MyAnswerMgm[], attackStrategyID: number) => {
                        const augmentedAttackStrategy: AugmentedAttackStrategy = this.augmentedAttackStrategiesMap.get(attackStrategyID);
                        const questionsAnswerMap: Map<number, Couple<QuestionMgm, AnswerMgm>> = new Map<number/*QuestionID*/, Couple<QuestionMgm, AnswerMgm>>();

                        myAnswers.forEach((myAnswer: MyAnswerMgm) => {
                            const question: QuestionMgm = myAnswer.question;
                            const answer: AnswerMgm = myAnswer.answer;

                            questionsAnswerMap.set(question.id, new Couple<QuestionMgm, AnswerMgm>(question, answer));
                        });

                        const attackStrategyUpdate: AttackStrategyUpdate = new AttackStrategyUpdate(augmentedAttackStrategy, questionsAnswerMap);

                        augmentedAttackStrategy.cisoAnswersLikelihoodNumber = WeaknessUtils.attackStrategyAnswersLikelihood(attackStrategyUpdate, this.answerWeightMap);
                        augmentedAttackStrategy.cisoAnswersLikelihood = WeaknessUtils.numberToAttackStrategyLikelihood(augmentedAttackStrategy.cisoAnswersLikelihoodNumber);

                        augmentedAttackStrategy.contextualLikelihoodNumber = WeaknessUtils.attackStrategyContextualLikelihood(augmentedAttackStrategy.initialLikelihoodNumber, augmentedAttackStrategy.cisoAnswersLikelihoodNumber);
                        augmentedAttackStrategy.contextualLikelihood = WeaknessUtils.numberToAttackStrategyLikelihood(augmentedAttackStrategy.contextualLikelihoodNumber);

                        augmentedAttackStrategy.updateCssClass();
                    });

                    this.selfAssessment = joinResponse[2].body;
                    console.log('SelfAssessment: ' + JSON.stringify(this.selfAssessment));

                    this.threatAgents = this.selfAssessment.threatagents;
                    console.log('ThreatAgents: ' + JSON.stringify(this.threatAgents));
                });
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    threatAgentChanged(threatAgent: ThreatAgentMgm) {
        WeaknessUtils.threatAgentChanged(threatAgent, this.augmentedAttackStrategiesMap);
    }
}
