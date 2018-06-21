import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {ThreatAgentMgm} from '../../entities/threat-agent-mgm';
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
import {concatMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs/observable/forkJoin';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class ThreatResultComponent implements OnInit, OnDestroy {
    private threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[];
    private defaultThreatAgents: ThreatAgentMgm[];
    private identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;
    private subscriptions: Subscription[] = [];
    private questionnaire: QuestionnaireMgm;

    private static YES: string = 'YES';
    private static NO: string = 'NO';

    // ThreatAgents Motivations
    motivtions$: Observable<HttpResponse<MotivationMgm[]>>;
    motivations: MotivationMgm[];

    // QuestionnaireStatus
    private questionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>>;
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

    constructor(private dataSharingService: DatasharingService,
                private identifyThreatAgentService: IdentifyThreatAgentService,
                private myAnswerService: MyAnswerMgmService,
                private accountService: AccountService,
                private userService: UserService,
                private router: Router,
                private route: ActivatedRoute,
                private questionService: QuestionMgmService,
                private questionnairesService: QuestionnairesService,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                private motivationsService: MotivationMgmService) {
    }

    ngOnInit() {
        // Create the Observable for the QuestionnaireStatus having the ID in the url.
        this.questionnaireStatus$ = this.route.params.pipe(
            concatMap((params: Params) => {
                const questionnaireStatusID: number = params['statusID'];
                console.log('Route questionnaireStatusID: ' + questionnaireStatusID);

                return this.questionnaireStatusService.find(questionnaireStatusID);
            })
        );

        // First Fetch the QuestionnaireStatus with the above observable.
        // Then Create the Observable for the Questions and MyAnswers belonging to the fetched QuestionnaireStatus.
        this.questionsMyAnswers$ = this.questionnaireStatus$.pipe(
            concatMap((questionnaireStatusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                this.questionnaireStatus = questionnaireStatusResponse.body;
                this.questionnaire = this.questionnaireStatus.questionnaire;

                this.questions$ = this.questionService.getQuestionsByQuestionnaire(this.questionnaire.id);
                this.myAnswers$ = this.myAnswerService.getAllByQuestionnaireStatusID(this.questionnaireStatus.id);

                return forkJoin(this.questions$, this.myAnswers$);
            })
        );

        // Create the Observable to fetch the Motivations of the ThreatAgents
        this.motivtions$ = this.motivationsService.query();

        forkJoin(this.questionsMyAnswers$, this.motivtions$).subscribe(
            (value: [[HttpResponse<QuestionMgm[]>, HttpResponse<MyAnswerMgm[]>], HttpResponse<MotivationMgm[]>]) => {
                this.questions = value[0][0].body;
                this.myAnswers = value[0][1].body;
                this.motivations = value[1].body;

                this.questionsMap = this.arrayToMap<QuestionMgm>(this.questions);

                this.threatAgentsPercentageMap = this.questionsMyAnswersToThreatAgentsPercentageMap(this.questionsMap, this.myAnswers);
            }
        );

        this.threatAgentsMap = this.dataSharingService.threatAgentsMap;
        this.threatAgentsPercentageArray = Array.from(this.threatAgentsMap.values());

        this.subscriptions.push(
            this.identifyThreatAgentService.getDefaultThreatAgents().subscribe((response) => {
                this.defaultThreatAgents = response as ThreatAgentMgm[];

                this.defaultThreatAgents.forEach((value) => {// Add the default Threat-Agents to the list
                    this.threatAgentsPercentageArray.push(new Couple<ThreatAgentMgm, Fraction>(value, new Fraction(1, 1)));
                });
            })
        );

        console.log('Calling to find all motivations...');

        this.subscriptions.push(
            this.identifyThreatAgentService.findAllMotivations().subscribe((response) => {
                this.motivations = response as MotivationMgm[];
            })
        );

        this.identifyThreatAgentsFormDataMap = this.dataSharingService.identifyThreatAgentsFormDataMap;

        this.questionnaire = this.dataSharingService.currentQuestionnaire;
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

    questionsMyAnswersToThreatAgentsPercentageMap(questionsMap: Map<number, QuestionMgm>, myAnswers: MyAnswerMgm[]): Map<String, Couple<ThreatAgentMgm, Fraction>> {

        const map: Map<string, Couple<ThreatAgentMgm, Fraction>> = new Map<string, Couple<ThreatAgentMgm, Fraction>>();

        myAnswers.forEach((myAnswer: MyAnswerMgm) => {
            const question: QuestionMgm = this.questionsMap.get(myAnswer.question.id);
            const answer: AnswerMgm = myAnswer.answer;
            const threatAgent: ThreatAgentMgm = question.threatAgent;

            // The hash of the ThreatAgent JSON is used as the Key of the Map.
            const threatAgentHash = CryptoJS.SHA256(JSON.stringify(threatAgent)).toString();

            if (map.has(threatAgentHash)) {// a question identifying this threat agent has already been encountered.
                console.log('Threat agent already processed...');

                // fraction = #YES/#Questions
                const fraction: Fraction = map.get(threatAgentHash).value;
                // increment the number of questions identifying this threat-agent
                fraction.whole++;

                if (answer.name.toUpperCase() === ThreatResultComponent.YES) {
                    console.log('Warning: you answered YES');
                    fraction.part++;
                } else if (answer.name.toUpperCase() === ThreatResultComponent.NO) {
                    console.log('Good, you answered NO');
                }
            } else {// first time
                console.log('First Time processing this threat agent');

                const fraction = new Fraction(0, 1);
                map.set(threatAgentHash, new Couple<ThreatAgentMgm, Fraction>(threatAgent, fraction));

                if (answer.name.toUpperCase() === ThreatResultComponent.YES) {
                    console.log('Warning: you answered YES');
                    fraction.part++;
                } else if (answer.name.toUpperCase() === ThreatResultComponent.NO) {
                    console.log('Good, you answered NO');
                }
            }
        });

        return map;
    }
}
