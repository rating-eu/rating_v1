import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuestionnairesService} from '../questionnaires.service';
import {QuestionnaireMgm} from '../../entities/questionnaire-mgm';
import {Observable} from 'rxjs/Observable';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {QuestionnaireStatusMgm} from '../../entities/questionnaire-status-mgm';
import {Status} from '../../entities/enumerations/QuestionnaireStatus.enum';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {AccountService, User, UserService} from '../../shared';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {QuestionnairePurpose} from '../../entities/enumerations/QuestionnairePurpose.enum';
import {MyAnswerMgmService} from '../../entities/my-answer-mgm';
import {IdentifyThreatAgentService} from '../../identify-threat-agent/identify-threat-agent.service';
import {EvaluateService} from '../../evaluate-weakness/evaluate-weakness.service';

@Component({
    selector: 'jhi-questionnaires',
    templateUrl: './questionnaires.component.html',
    styles: [],
})
export class QuestionnairesComponent implements OnInit, OnDestroy {

    private statusEnum = Status;
    private purposeEnum = QuestionnairePurpose;
    private purpose: QuestionnairePurpose;
    questionnaires$: Observable<QuestionnaireMgm[]>;
    private selfAssessment: SelfAssessmentMgm;
    private account: Account;
    private user: User;
    private subscriptions: Subscription[] = [];
    private questionnaireStatuses: QuestionnaireStatusMgm[];
    private questionnaireStatusesMap: Map<number, QuestionnaireStatusMgm>;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private questionnairesService: QuestionnairesService,
                private dataSharingService: DatasharingService,
                private selfAssessmentService: SelfAssessmentMgmService,
                private accountService: AccountService,
                private userService: UserService,
                private myAnswerService: MyAnswerMgmService,
                private identifyThreatAgentsService: IdentifyThreatAgentService,
                private evaluateWeaknessService: EvaluateService) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.route.params.subscribe(
                (params: Params) => {
                    const routeQuestionnairePurpose = params['purpose'];
                    console.log('Route purpose: ' + routeQuestionnairePurpose);

                    switch (routeQuestionnairePurpose) {
                        case QuestionnairePurpose[QuestionnairePurpose.ID_THREAT_AGENT]: {
                            this.purpose = QuestionnairePurpose.ID_THREAT_AGENT;
                            break;
                        }
                        case QuestionnairePurpose[QuestionnairePurpose.SELFASSESSMENT]: {
                            this.purpose = QuestionnairePurpose.SELFASSESSMENT;
                            break;
                        }
                    }

                    this.questionnaires$ = this.questionnairesService.getAllQuestionnairesByPurpose(this.purpose);
                }
            )
        );

        this.selfAssessment = this.selfAssessmentService.getSelfAssessment();

        this.subscriptions.push(
            this.accountService.get().subscribe((response1) => {
                this.account = response1.body;

                this.subscriptions.push(
                    this.userService.find(this.account['login']).subscribe((response2) => {
                        this.user = response2.body;

                        this.subscriptions.push(
                            this.questionnairesService.getQuestionnaireStatusesBySelfAssessmentAndUser(this.selfAssessment, this.user)
                                .subscribe((response: QuestionnaireStatusMgm[]) => {
                                    this.questionnaireStatuses = response;
                                    this.questionnaireStatusesMap = new Map<number, QuestionnaireStatusMgm>();
                                    this.questionnaireStatuses.forEach((questionnaireStatus: QuestionnaireStatusMgm) => {
                                        this.questionnaireStatusesMap.set(questionnaireStatus.questionnaire.id, questionnaireStatus);
                                    });

                                    this.dataSharingService.questionnaireStatusesMap = this.questionnaireStatusesMap;
                                })
                        );
                    })
                );
            })
        );
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    setCurrentQuestionnaire(questionnaire: QuestionnaireMgm) {
        if (!this.questionnaireStatusesMap) {
            this.subscriptions.push(
                this.questionnairesService.getQuestionnaireStatusesBySelfAssessmentAndUser(this.selfAssessment, this.user)
                    .subscribe((response: QuestionnaireStatusMgm[]) => {
                        this.questionnaireStatuses = response;
                        this.questionnaireStatusesMap = new Map<number, QuestionnaireStatusMgm>();
                        this.questionnaireStatuses.forEach((questionnaireStatus: QuestionnaireStatusMgm) => {
                            this.questionnaireStatusesMap.set(questionnaireStatus.questionnaire.id, questionnaireStatus);
                        });

                        this.dataSharingService.questionnaireStatusesMap = this.questionnaireStatusesMap;
                    })
            );
        } else {

        }

        this.dataSharingService.currentQuestionnaire = questionnaire;

        if (this.questionnaireStatusesMap.has(questionnaire.id)) {
            this.dataSharingService.questionnaireStatus = this.questionnaireStatusesMap.get(questionnaire.id);
        } else {
            const emptyQStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined, Status.EMPTY, this.selfAssessment, questionnaire, this.user, questionnaire);
            this.dataSharingService.questionnaireStatus = emptyQStatus;
        }
    }

    showThreatAgents(questionnaireStatus: QuestionnaireStatusMgm) {
        console.log('Show Threat Agents...');
        console.log('Status...');
        console.log(JSON.stringify(questionnaireStatus));

        // delegate the routing stuff to the service inside the ThreatAgents module.
        this.identifyThreatAgentsService.showThreatAgentsResult(questionnaireStatus);
    }

    showAttackStrategies(questionnaireStatus: QuestionnaireStatusMgm) {
        console.log('Show Attack Strategies...');
        console.log('Status...');
        console.log(JSON.stringify(questionnaireStatus));

        this.evaluateWeaknessService.showEvaluatedAttackStrategies(questionnaireStatus);
    }
}
