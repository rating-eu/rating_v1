import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {ThreatAgentMgm} from '../../entities/threat-agent-mgm';
import {Couple} from '../../utils/couple.class';
import {Fraction} from '../../utils/fraction.class';
import {IdentifyThreatAgentService} from '../identify-threat-agent.service';
import {MotivationMgm} from '../../entities/motivation-mgm';
import {AnswerMgm} from '../../entities/answer-mgm';
import {AccountService, User, UserService} from '../../shared';
import {QuestionMgm, QuestionMgmService} from '../../entities/question-mgm';
import {QuestionnaireMgm} from '../../entities/questionnaire-mgm';
import {MyAnswerMgm, MyAnswerMgmService} from '../../entities/my-answer-mgm';
import {Router} from '@angular/router';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {Subscription} from 'rxjs/Subscription';
import {QuestionnairesService} from '../../questionnaires/questionnaires.service';
import {QuestionnaireStatusMgm, QuestionnaireStatusMgmService} from '../../entities/questionnaire-status-mgm';
import {Status} from '../../entities/enumerations/QuestionnaireStatus.enum';
import {HttpResponse} from '@angular/common/http';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class ResultComponent implements OnInit, OnDestroy {
    private threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[];
    motivations: MotivationMgm[];
    private defaultThreatAgents: ThreatAgentMgm[];
    private identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;
    private account: Account;
    private user: User;
    private selfAssessment: SelfAssessmentMgm;
    private subscriptions: Subscription[] = [];
    private questionnaire: QuestionnaireMgm;

    constructor(private dataSharingService: DatasharingService,
                private identifyThreatAgentService: IdentifyThreatAgentService,
                private myAnswerService: MyAnswerMgmService,
                private accountService: AccountService,
                private userService: UserService,
                private selfAssessmentService: SelfAssessmentMgmService,
                private router: Router,
                private questionService: QuestionMgmService,
                private questionnairesService: QuestionnairesService,
                private questionnaireStatusService: QuestionnaireStatusMgmService) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.accountService.get().subscribe((response1) => {
                this.account = response1.body;

                this.subscriptions.push(
                    this.userService.find(this.account['login']).subscribe((response2) => {
                        this.user = response2.body;
                    })
                );

                this.selfAssessment = this.selfAssessmentService.getSelfAssessment();
            })
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

    saveIdentfiedThreatAgents() {
        console.log('Saving identified threat agents...');
        console.log('Account: ' + JSON.stringify(this.account));
        console.log('User: ' + JSON.stringify(this.user));

        let questionnaireStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined, Status.FULL, this.selfAssessment, this.questionnaire, this.user, []);

        // Getting the id of the above QuestionnaireStatus
        this.questionnaireStatusService.create(questionnaireStatus).subscribe((statusResponse) => {
            questionnaireStatus = statusResponse.body;

            this.identifyThreatAgentsFormDataMap.forEach((value: AnswerMgm, key: String) => {
                const answer: AnswerMgm = value;
                console.log('Answer: ' + JSON.stringify(answer));

                this.questionService.find(Number(key))
                    .toPromise()
                    .then((result: HttpResponse<QuestionMgm>) => {
                        const question: QuestionMgm = result.body;
                        const questionnaire: QuestionnaireMgm = question.questionnaire;

                        console.log('Question: ' + JSON.stringify(question));
                        console.log('Questionnaire: ' + JSON.stringify(questionnaire));

                        const myAnser: MyAnswerMgm = new MyAnswerMgm(undefined, 'Checked', answer, question, questionnaire, questionnaireStatus, this.user);

                        console.log('MyAnser: ' + myAnser);

                        // persist the answer of the user
                        this.myAnswerService.create(myAnser)
                            .toPromise()
                            .then((response: HttpResponse<MyAnswerMgm>) => {
                                const myAnswerResult: MyAnswerMgm = response.body;
                                console.log('MyAnswer response: ' + JSON.stringify(myAnswerResult));
                            });
                    });
            });
        });

        const identifiedThreatAgents: ThreatAgentMgm[] = [];

        this.threatAgentsPercentageArray.forEach((couple: Couple<ThreatAgentMgm, Fraction>) => {
            const threatAgent: ThreatAgentMgm = couple.key;
            const likelihood: Fraction = couple.value;
            console.log('Threat-Agent: ' + JSON.stringify(threatAgent));
            console.log('Likelihood: ' + likelihood.toPercentage());

            if (likelihood.toPercentage() > 0) {
                identifiedThreatAgents.push(threatAgent);
            }
        });

        const uniqueThreatAgentsSet: Set<ThreatAgentMgm> = new Set<ThreatAgentMgm>(identifiedThreatAgents.concat(this.selfAssessment.threatagents));
        const uniqueThreatAgentsArray: ThreatAgentMgm[] = [...uniqueThreatAgentsSet];
        this.selfAssessment.threatagents = uniqueThreatAgentsArray;

        console.log('AllThreatAgents: ' + JSON.stringify(this.selfAssessment.threatagents));

        this.selfAssessment.questionnaires = [...new Set<QuestionnaireMgm>(this.selfAssessment.questionnaires.concat(this.questionnaire))];
        this.selfAssessment.user = this.user;

        // Update the SelfAssessment
        this.selfAssessmentService.update(this.selfAssessment).subscribe((response) => {
            const result: SelfAssessmentMgm = response.body;
            console.log('updated SelfAssessment: ' + JSON.stringify(this.selfAssessment));
        });

        this.router.navigate(['identify-threat-agent']);
    }

    discardIdentfiedThreatAgents() {
        console.log('Discarding identified threat agents...');
        this.router.navigate(['identify-threat-agent']);
    }
}
