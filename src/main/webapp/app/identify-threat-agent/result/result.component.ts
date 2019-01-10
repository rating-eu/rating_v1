import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {ThreatAgentMgm, ThreatAgentMgmService} from '../../entities/threat-agent-mgm';
import {Couple} from '../../utils/couple.class';
import {Fraction} from '../../utils/fraction.class';
import {IdentifyThreatAgentService} from '../identify-threat-agent.service';
import {MotivationMgm, MotivationMgmService} from '../../entities/motivation-mgm';
import {AnswerMgm} from '../../entities/answer-mgm';
import {AccountService, BaseEntity, UserService} from '../../shared';
import {QuestionMgm, QuestionMgmService} from '../../entities/question-mgm';
import {QuestionnaireMgm} from '../../entities/questionnaire-mgm';
import {MyAnswerMgm, MyAnswerMgmService} from '../../entities/my-answer-mgm';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {QuestionnairesService} from '../../questionnaires/questionnaires.service';
import {QuestionnaireStatusMgm, QuestionnaireStatusMgmService} from '../../entities/questionnaire-status-mgm';
import {HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {concatMap, mergeMap} from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {SkillLevel} from '../../entities/enumerations/SkillLevel.enum';
import {AnswerLikelihood} from '../../entities/enumerations/AnswerLikelihood.enum';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class ThreatResultComponent implements OnInit, OnDestroy {
    private static YES = 'YES';
    private static NO = 'NO';

    private subscriptions: Subscription[] = [];
    private questionnaire: QuestionnaireMgm;

    // ThreatAgents
    private defaultThreatAgents$: Observable<HttpResponse<ThreatAgentMgm[]>>;
    private defaultThreatAgents: ThreatAgentMgm[];

    // Motivations
    private motivations$: Observable<HttpResponse<MotivationMgm[]>>;
    public motivations: MotivationMgm[];

    private defaultThreatAgentsMotivations$: Observable<[HttpResponse<ThreatAgentMgm[]>, HttpResponse<MotivationMgm[]>]>;

    // QuestionnaireStatus
    private questionnaireStatuses$: Observable<HttpResponse<QuestionnaireStatusMgm[]>>;
    private questionnaireStatus: QuestionnaireStatusMgm;

    // MyAnswers
    private myAnswers$: Observable<HttpResponse<MyAnswerMgm[]>>;
    private myAnswers: MyAnswerMgm[];

    // Questions
    private questions$: Observable<HttpResponse<QuestionMgm[]>>;
    private questions: QuestionMgm[];
    private questionsMap: Map<number, QuestionMgm>;

    // Questions & MyAnswers Join
    private questionsMyAnswers$: Observable<[HttpResponse<QuestionMgm[]>, HttpResponse<MyAnswerMgm[]>]>;

    // ThreatAgents Percentage Map
    private threatAgentsPercentageMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[];

    public selectedThreatAgent: ThreatAgentMgm = null;
    public page = 1;

    constructor(private selfAssessmentService: SelfAssessmentMgmService,
                private dataSharingService: DatasharingService,
                private identifyThreatAgentService: IdentifyThreatAgentService,
                private myAnswerService: MyAnswerMgmService,
                private accountService: AccountService,
                private userService: UserService,
                private router: Router,
                private questionService: QuestionMgmService,
                private questionnairesService: QuestionnairesService,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                private motivationsService: MotivationMgmService,
                private threatAgentService: ThreatAgentMgmService) {
    }

    ngOnInit() {
        const selfAssessment = this.selfAssessmentService.getSelfAssessment();
        this.questionnaireStatuses$ = this.questionnaireStatusService.getAllBySelfAssessmentAndQuestionnairePurpose(selfAssessment.id, 'ID_THREAT_AGENT');

        // First Fetch the QuestionnaireStatus with the above observable.
        // Then Create the Observable for the Questions and MyAnswers belonging to the fetched QuestionnaireStatus.
        this.questionsMyAnswers$ = this.questionnaireStatuses$.pipe(
            mergeMap((questionnaireStatusResponse: HttpResponse<QuestionnaireStatusMgm[]>) => {
                this.questionnaireStatus = questionnaireStatusResponse.body[0];
                this.questionnaire = this.questionnaireStatus.questionnaire;
                this.questions$ = this.questionService.getQuestionsByQuestionnaire(this.questionnaire.id);
                this.myAnswers$ = this.myAnswerService.getAllByQuestionnaireStatusID(this.questionnaireStatus.id);
                return forkJoin(this.questions$, this.myAnswers$);
            })
        );

        // Create the Observable to fetch the Motivations of the ThreatAgents
        this.motivations$ = this.motivationsService.query();

        // Create the Observable to fetch the default ThreatAgents
        this.defaultThreatAgents$ = this.threatAgentService.getDefaultThreatAgents();

        // Chain observables
        this.defaultThreatAgentsMotivations$ =
            this.questionsMyAnswers$.mergeMap(
                (response: [HttpResponse<QuestionMgm[]>, HttpResponse<MyAnswerMgm[]>]) => {
                    this.questions = response[0].body;
                    this.myAnswers = response[1].body;
                    return forkJoin(this.defaultThreatAgents$, this.motivations$);
                }
            );

        this.defaultThreatAgentsMotivations$.subscribe(
            (response: [HttpResponse<ThreatAgentMgm[]>, HttpResponse<MotivationMgm[]>]) => {
                this.defaultThreatAgents = response[0].body;
                this.motivations = response[1].body;
                this.questionsMap = this.arrayToMap<QuestionMgm>(this.questions);

                this.threatAgentsPercentageMap = this.questionsMyAnswersToThreatAgentsPercentageMap(this.questionsMap, this.myAnswers, this.defaultThreatAgents);
                this.threatAgentsPercentageArray = Array.from(this.threatAgentsPercentageMap.values());

                // Sort ThreatAgents by Skills * Accuracy
                this.threatAgentsPercentageArray = this.threatAgentsPercentageArray.sort(
                    (a: Couple<ThreatAgentMgm, Fraction>, b: Couple<ThreatAgentMgm, Fraction>) => {
                        const aSkill: number = Number(SkillLevel[a.key.skillLevel]);
                        const bSkill: number = Number(SkillLevel[b.key.skillLevel]);

                        const aAccuracy: number = Number(a.value.toPercentage().toFixed(2));
                        const bAccuracy: number = Number(b.value.toPercentage().toFixed(2));

                        const aStrength: number = aSkill * aAccuracy;
                        const bStrength: number = bSkill * bAccuracy;

                        const result = (aStrength - bStrength) * -1;

                        return result;
                    }
                );
            }
        );
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    hasMotivation(threatAgent: ThreatAgentMgm, motivation: MotivationMgm): boolean {
        const found = threatAgent.motivations.find((m) => {
            return m.id === motivation.id;
        });

        return found !== undefined;
    }

    /**
     * Converts the input array to a Map having the item's ID as the KEY and the item itself as the VALUE.
     * Attention: If the array contains more items with the same ID, only the last of them will be present.
     * The id of the item must be a number.
     * @param {T[]} array The input array.
     * @returns {Map<number, T extends BaseEntity>} The output map.
     */
    arrayToMap<T extends BaseEntity>(array: T[]): Map<number, T> {

        const map: Map<number, T> = new Map<number, T>();

        array.forEach((item: T) => {
            map.set(Number(item.id), item);
        });

        return map;
    }

    questionsMyAnswersToThreatAgentsPercentageMap(questionsMap: Map<number, QuestionMgm>,
                                                  myAnswers: MyAnswerMgm[],
                                                  defaultThreatAgents: ThreatAgentMgm[]): Map<String, Couple<ThreatAgentMgm, Fraction>> {

        const map: Map<string, Couple<ThreatAgentMgm, Fraction>> = new Map<string, Couple<ThreatAgentMgm, Fraction>>();

        myAnswers.forEach((myAnswer: MyAnswerMgm) => {
            const question: QuestionMgm = this.questionsMap.get(myAnswer.question.id);
            const answer: AnswerMgm = myAnswer.answer;
            const threatAgent: ThreatAgentMgm = question.threatAgent;

            // The hash of the ThreatAgent JSON is used as the Key of the Map.
            const threatAgentHash: string = CryptoJS.SHA256(JSON.stringify(threatAgent)).toString();

            if (map.has(threatAgentHash)) {// a question identifying this threat agent has already been encountered.
                // fraction = #YES/#Questions
                const fraction: Fraction = map.get(threatAgentHash).value;
                // increment the number of questions identifying this threat-agent
                fraction.whole++;

                if (answer.name.toUpperCase() === ThreatResultComponent.YES) {
                    fraction.part++;
                } else if (answer.name.toUpperCase() === ThreatResultComponent.NO) {
                }
            } else {// first time
                const fraction = new Fraction(0, 1);
                map.set(threatAgentHash, new Couple<ThreatAgentMgm, Fraction>(threatAgent, fraction));

                if (answer.name.toUpperCase() === ThreatResultComponent.YES) {
                    fraction.part++;
                } else if (answer.name.toUpperCase() === ThreatResultComponent.NO) {
                }
            }
        });

        // Default ThreatAgents
        defaultThreatAgents.forEach((threatAgent: ThreatAgentMgm) => {
            // The hash of the ThreatAgent JSON is used as the Key of the Map.
            const threatAgentHash: string = CryptoJS.SHA256(JSON.stringify(threatAgent)).toString();
            const fraction: Fraction = new Fraction(1, 1); // 100%
            const couple: Couple<ThreatAgentMgm, Fraction> = new Couple<ThreatAgentMgm, Fraction>(threatAgent, fraction);

            map.set(threatAgentHash, couple);
        });

        return map;
    }

    selectThreatAgent(threatAgent: ThreatAgentMgm) {
        if (this.selectedThreatAgent) {
            if (this.selectedThreatAgent.id === threatAgent.id) {
                this.selectedThreatAgent = null;
            }else {
                this.selectedThreatAgent = threatAgent;
            }
        } else {
            this.selectedThreatAgent = threatAgent;
        }
    }
}
