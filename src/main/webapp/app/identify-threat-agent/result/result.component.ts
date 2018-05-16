import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {ThreatAgentMgm} from '../../entities/threat-agent-mgm';
import {Couple} from '../../utils/couple.class';
import {Fraction} from '../../utils/fraction.class';
import {IdentifyThreatAgentService} from '../identify-threat-agent.service';
import {MotivationMgm} from '../../entities/motivation-mgm';
import {AnswerMgm} from '../../entities/answer-mgm';
import {AccountService, User, UserService} from '../../shared';
import {QuestionMgm} from '../../entities/question-mgm';
import {QuestionnaireMgm} from '../../entities/questionnaire-mgm';
import {MyAnswerMgm, MyAnswerMgmService} from '../../entities/my-answer-mgm';
import {Router} from '@angular/router';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {Subscription} from 'rxjs/Subscription';
import {QuestionnairesService} from '../../questionnaires/questionnaires.service';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class ResultComponent implements OnInit, OnDestroy {
    private threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[];
    private motivations: MotivationMgm[];
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
                private questionnairesService: QuestionnairesService) {
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

        this.identifyThreatAgentsFormDataMap.forEach((value: AnswerMgm, key: String) => {
            const answer: AnswerMgm = value;
            const question: QuestionMgm = answer.question;
            const questionnaire: QuestionnaireMgm = question.questionnaire;

            console.log('Answer: ' + JSON.stringify(answer));
            console.log('Question: ' + JSON.stringify(question));
            console.log('Questionnaire: ' + JSON.stringify(questionnaire));

            const myAnser: MyAnswerMgm = new MyAnswerMgm(undefined, 'Checked', answer, question, questionnaire, this.user);

            console.log('MyAnser: ' + myAnser);

            // persist the answer of the user
            this.myAnswerService.create(myAnser).subscribe((response) => {
                const result: MyAnswerMgm = response.body;
                console.log('MyAnswer response: ' + JSON.stringify(result));
            });
        });

        const threatAgents: ThreatAgentMgm[] = [];

        this.threatAgentsPercentageArray.forEach((threatPercentage) => {
            const threatAgent: ThreatAgentMgm = threatPercentage.key;
            console.log('Threat-Agent: ' + JSON.stringify(threatAgent));

            threatAgents.push(threatAgent);
        });

        const uniqueThreatAgentsSet: Set<ThreatAgentMgm> = new Set<ThreatAgentMgm>(threatAgents.concat(this.selfAssessment.threatagents));
        const uniqueThreatAgentsArray: ThreatAgentMgm[] = [...uniqueThreatAgentsSet];
        this.selfAssessment.threatagents = uniqueThreatAgentsArray;

        console.log('AllThreatAgents: ' + JSON.stringify(this.selfAssessment.threatagents));

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
