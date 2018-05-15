import {Component, OnInit} from '@angular/core';
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
import {SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class ResultComponent implements OnInit {

    threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[];
    motivations: MotivationMgm[];
    defaultThreatAgents: ThreatAgentMgm[];
    identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;
    private account: Account;
    private user: User;

    constructor(private dataSharingService: DatasharingService,
                private identifyThreatAgentService: IdentifyThreatAgentService,
                private myAnswerService: MyAnswerMgmService,
                private accountService: AccountService,
                private userService: UserService,
                private selfAssessmentService: SelfAssessmentMgmService,
                private router: Router) {
    }

    ngOnInit() {
        this.accountService.get().subscribe((response1) => {
            this.account = response1.body;

            this.userService.find(this.account['login']).subscribe((response2) => {
                this.user = response2.body;
            });
        });

        this.threatAgentsMap = this.dataSharingService.threatAgentsMap;
        this.threatAgentsPercentageArray = Array.from(this.threatAgentsMap.values());

        this.identifyThreatAgentService.getDefaultThreatAgents().subscribe((response) => {
            this.defaultThreatAgents = response as ThreatAgentMgm[];

            this.defaultThreatAgents.forEach((value) => {// Add the default Threat-Agents to the list
                this.threatAgentsPercentageArray.push(new Couple<ThreatAgentMgm, Fraction>(value, new Fraction(1, 1)));
            });
        });

        console.log('Calling to find all motivations...');
        this.identifyThreatAgentService.findAllMotivations().subscribe((response) => {
            this.motivations = response as MotivationMgm[];
        });

        this.identifyThreatAgentsFormDataMap = this.dataSharingService.identifyThreatAgentsFormDataMap;
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

            this.myAnswerService.create(myAnser).subscribe((response) => {
                const result: MyAnswerMgm = response.body;
                console.log('MyAnswer response: ' + JSON.stringify(result));
            });
        });
    }

    discardIdentfiedThreatAgents() {
        console.log('Discarding identified threat agents...');
        this.router.navigate(['identify-threat-agent']);
    }
}
