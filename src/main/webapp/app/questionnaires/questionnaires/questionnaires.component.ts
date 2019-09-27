/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import * as _ from 'lodash';
import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {QuestionnairesService} from '../questionnaires.service';
import {QuestionnaireMgm} from '../../entities/questionnaire-mgm';
import {Observable} from 'rxjs/Observable';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {QuestionnaireStatusMgm, QuestionnaireStatusMgmService} from '../../entities/questionnaire-status-mgm';
import {Status} from '../../entities/enumerations/QuestionnaireStatus.enum';
import {Account, AccountService, User, UserService} from '../../shared';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {QuestionnairePurpose} from '../../entities/enumerations/QuestionnairePurpose.enum';
import {MyAnswerMgmService} from '../../entities/my-answer-mgm';
import {IdentifyThreatAgentService} from '../../identify-threat-agent/identify-threat-agent.service';
import {EvaluateService} from '../../evaluate-weakness/evaluate-weakness.service';
import {LocalStorageService} from 'ngx-webstorage';
import {HttpResponse} from '@angular/common/http';
import {MyCompanyMgm} from '../../entities/my-company-mgm';
import {switchMap} from 'rxjs/operators';
import {Role} from '../../entities/enumerations/Role.enum';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';
import {EventManagerService} from '../../datasharing/event-manager.service';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {AssessVulnerabilitiesCompletionDTO} from '../../dto/completion/assess-vulnerabilities-completion';
import {CompletionDtoService} from '../../dto/completion/completion-dto.service';
import {of} from 'rxjs/observable/of';
import {EventType} from '../../entities/enumerations/EventType.enum';
import {Event} from '../../datasharing/event.model';

@Component({
    selector: 'jhi-questionnaires',
    templateUrl: './questionnaires.component.html',
    styles: []
})
export class QuestionnairesComponent implements OnInit, OnDestroy {
    private showCompletionPercentages: boolean;
    private useExistingThreatAgentQuestionnaireStatus: boolean;
    private createNewThreatAgentsQuestionnaireStatus: boolean;

    public statusEnum = Status;
    public roleEnum = Role;
    public purposeEnum = QuestionnairePurpose;
    public purpose: QuestionnairePurpose;

    private static CISO_ROLE: string = Role[Role.ROLE_CISO];
    private static EXTERNAL_ROLE: string = Role[Role.ROLE_EXTERNAL_AUDIT];

    private questionnaire$: Observable<QuestionnaireMgm>;
    private questionnaire: QuestionnaireMgm;

    public externalAudits: User[];

    public questionnaireStatuses$: Observable<QuestionnaireStatusMgm[]>;
    private questionnaireStatuses: QuestionnaireStatusMgm[];

    private questionnaireStatusesChangeEventSubscription: Subscription;

    private myCompany$: Observable<HttpResponse<MyCompanyMgm>>;
    private myCompany: MyCompanyMgm;

    private account$: Observable<HttpResponse<Account>>;
    private account: Account;
    private role: Role;

    private user$: Observable<HttpResponse<User>>;
    private user: User;

    private subscriptions: Subscription[] = [];

    public externalChangedMap: Map<number/*QStatus.ID*/, boolean>;

    public assessVulnerabilitiesCompletionMap: Map<number/*QStatus.ID*/, AssessVulnerabilitiesCompletionDTO>;

    public canCreateNewQuestionnaireStatus;

    // To avoid creating two QuestionnaireStatus for Threat Agents
    private loadingQuestionnairesSemaphore: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private questionnairesService: QuestionnairesService,
                private dataSharingService: DatasharingService,
                private accountService: AccountService,
                private userService: UserService,
                private myAnswerService: MyAnswerMgmService,
                private identifyThreatAgentsService: IdentifyThreatAgentService,
                private evaluateWeaknessService: EvaluateService,
                private localStorage: LocalStorageService,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                public popUpService: PopUpService,
                private eventManagerService: EventManagerService,
                private completionService: CompletionDtoService,
                private changeDetector: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        console.log('Questionnaires ON INIT');

        this.loadingQuestionnairesSemaphore = false;

        this.canCreateNewQuestionnaireStatus = true;
        this.showCompletionPercentages = false;
        this.useExistingThreatAgentQuestionnaireStatus = false;
        this.createNewThreatAgentsQuestionnaireStatus = false;

        const join$: Observable<[Account, User, Role, MyCompanyMgm]> = forkJoin(
            this.dataSharingService.account$
                .timeout(500)
                .catch((err) => {
                    console.warn('Account timeout...');
                    return of(this.dataSharingService.account);
                }),
            this.dataSharingService.user$
                .timeout(500)
                .catch((err) => {
                    console.warn('User timeout...');
                    return of(this.dataSharingService.user);
                }),
            this.dataSharingService.role$
                .timeout(500)
                .catch((err) => {
                    console.warn('Role timeout...');
                    return of(this.dataSharingService.role);
                }),
            this.dataSharingService.myCompany$
                .timeout(500)
                .catch((err, caught) => {
                    console.warn('MyCompany timeout...');
                    return of(this.dataSharingService.myCompany);
                })
        );

        this.subscriptions.push(
            join$.subscribe((response: [Account, User, Role, MyCompanyMgm]) => {
                this.account = response[0];
                this.user = response[1];
                this.role = response[2];
                this.myCompany = response[3];

                // Listen for when a new QuestionnaireStatus is created
                this.registerChangeInQuestionnaireStatuses();

                if (this.account && this.user && this.role && this.myCompany && this.myCompany.companyProfile) {
                    console.log('Calling loadQuestionnaires subscription');
                    this.loadQuestionnaireStatuses();
                }
            })
        );

        this.externalChangedMap = new Map();
        this.assessVulnerabilitiesCompletionMap = new Map();
    }

    private loadQuestionnaireStatuses() {
        console.log('Loading questionnaires');

        if (!this.loadingQuestionnairesSemaphore) {
            console.log('Inside if ! loading questionnaires semaphore');

            this.loadingQuestionnairesSemaphore = true;

            const params$ = this.route.params;

            // GET the questionnaires by purpose
            const questionnaireAndStatusesJoin$: Observable<[QuestionnaireMgm, QuestionnaireStatusMgm[]]> = params$.pipe(
                switchMap((params: Params) => {
                    const routeQuestionnairePurpose = params['purpose'];

                    console.log('Inside Params:');
                    console.log(routeQuestionnairePurpose);

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

                    this.questionnaire$ = this.questionnairesService.getQuestionnaireByPurposeAndCompanyType(this.purpose, this.myCompany.companyProfile.type)
                        .catch((err) => {
                            return of({});
                        });

                    switch (this.purpose) {
                        case QuestionnairePurpose.ID_THREAT_AGENT: {

                            // Get all the QuestionnaireStatuses for Identifying the ThreatAgents of the CompanyProfile
                            this.questionnaireStatuses$ = this.questionnaireStatusService
                                .getAllQuestionnaireStatusesByCompanyProfileQuestionnairePurposeAndRole(this.myCompany.companyProfile, this.purpose, this.role)
                                .catch((err) => {
                                    return of([])
                                });

                            break;
                        }
                        case QuestionnairePurpose.SELFASSESSMENT: {

                            this.questionnaireStatuses$ = this.questionnaireStatusService
                                .getAllQuestionnaireStatusesByCompanyProfileQuestionnairePurposeAndRole(this.myCompany.companyProfile, this.purpose, this.role)
                                .catch((err) => {
                                    return of([])
                                });

                            break;
                        }
                    }

                    return forkJoin(this.questionnaire$, this.questionnaireStatuses$);
                })
            );

            const externalAudits$: Observable<User[]> = questionnaireAndStatusesJoin$.pipe(
                switchMap((response: [QuestionnaireMgm, QuestionnaireStatusMgm[]]) => {
                    this.questionnaire = response[0];
                    this.questionnaireStatuses = response[1];

                    console.log('Inside Questionnaires and Statuses...');

                    if (this.purpose === QuestionnairePurpose.SELFASSESSMENT && this.role === Role.ROLE_CISO) {
                        return this.userService.getExternalAuditsByCompanyProfile(this.myCompany.companyProfile.id)
                            .catch((err) => {
                                return of([]);
                            });
                    } else {
                        return of([]);
                    }
                })
            );

            const howToProceed$: Observable<HttpResponse<QuestionnaireStatusMgm> | {} | QuestionnaireStatusMgm | HttpResponse<AssessVulnerabilitiesCompletionDTO>[]> = externalAudits$.pipe(
                switchMap((response) => {
                        if (response) {
                            this.externalAudits = response;
                        } else {
                            this.externalAudits = [];
                        }

                        console.log('Inside How to proceed...');

                        if (this.questionnaireStatuses.length === 0) {
                            switch (this.purpose) {
                                case QuestionnairePurpose.ID_THREAT_AGENT: {
                                    // Create the first QuestionnaireStatus
                                    const questionnaireStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined,
                                        Status.EMPTY, undefined, undefined, this.myCompany.companyProfile,
                                        this.questionnaire, this.role, this.user, [], undefined, undefined);

                                    this.createNewThreatAgentsQuestionnaireStatus = true;
                                    return this.questionnaireStatusService.create(questionnaireStatus);
                                }
                                default: {
                                    return of(null);
                                }
                            }
                        } else {
                            switch (this.purpose) {
                                case QuestionnairePurpose.ID_THREAT_AGENT: {
                                    switch (this.role) {
                                        case Role.ROLE_CISO: {

                                            const cisoIdentifyThreatAgentsQuestionnaireStatusExists: QuestionnaireStatusMgm =
                                                _.find(this.questionnaireStatuses, (questionnaireStatus: QuestionnaireStatusMgm) => {

                                                    if (questionnaireStatus.role.valueOf() === Role.ROLE_CISO.valueOf()
                                                        && questionnaireStatus.questionnaire.purpose.valueOf() === QuestionnairePurpose.ID_THREAT_AGENT.valueOf()) {

                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                });

                                            if (cisoIdentifyThreatAgentsQuestionnaireStatusExists) {
                                                this.useExistingThreatAgentQuestionnaireStatus = true;
                                                this.createNewThreatAgentsQuestionnaireStatus = false;
                                                return of(cisoIdentifyThreatAgentsQuestionnaireStatusExists);
                                            } else {
                                                // Create the first QuestionnaireStatus
                                                const questionnaireStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined,
                                                    Status.EMPTY, undefined, undefined, this.myCompany.companyProfile,
                                                    this.questionnaire, this.role, this.user, [], undefined, undefined);

                                                this.useExistingThreatAgentQuestionnaireStatus = false;
                                                this.createNewThreatAgentsQuestionnaireStatus = true;
                                                return this.questionnaireStatusService.create(questionnaireStatus);
                                            }
                                        }
                                    }

                                    break;
                                }
                                case QuestionnairePurpose.SELFASSESSMENT: {
                                    switch (this.role) {
                                        case Role.ROLE_CISO: {
                                            const completions$ = [];

                                            // To reset it to TRUE at each update
                                            let guardian: boolean = true;

                                            this.questionnaireStatuses.forEach((questionnaireStatus) => {
                                                    completions$.push(
                                                        this.completionService
                                                            .getAssessVulnerabilitiesCompletionByCompanyProfileAndQuestionnaireStatus(this.myCompany.companyProfile.id, questionnaireStatus.id)
                                                    );

                                                    if (questionnaireStatus.status === Status.EMPTY || questionnaireStatus.status === Status.PENDING) {
                                                        guardian = false;
                                                        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                                                            this.changeDetector.detectChanges();
                                                        }
                                                    }
                                                }
                                            );

                                            this.canCreateNewQuestionnaireStatus = guardian;

                                            this.showCompletionPercentages = true;
                                            const join$: Observable<HttpResponse<AssessVulnerabilitiesCompletionDTO>[]> = forkJoin(completions$);

                                            return join$;
                                        }
                                        default: {
                                            return of(null);
                                        }
                                    }
                                }
                            }
                        }
                    }
                )
            );

            this.subscriptions.push(howToProceed$.subscribe(
                (response: HttpResponse<QuestionnaireStatusMgm> | null | QuestionnaireStatusMgm | HttpResponse<AssessVulnerabilitiesCompletionDTO>[]) => {

                    switch (this.purpose) {
                        case QuestionnairePurpose.ID_THREAT_AGENT: {
                            if (this.createNewThreatAgentsQuestionnaireStatus) {
                                this.createNewThreatAgentsQuestionnaireStatus = false;
                                this.useExistingThreatAgentQuestionnaireStatus = true;

                                const questionnaireStatus: QuestionnaireStatusMgm = (<HttpResponse<QuestionnaireStatusMgm>>response).body;
                                this.questionnaireStatuses.push(questionnaireStatus);

                                this.setCurrentQuestionnaireStatus(questionnaireStatus);

                                this.loadingQuestionnairesSemaphore = false;

                                this.router.navigate(['/identify-threat-agent/questionnaires/ID_THREAT_AGENT/questionnaire']);
                            } else if (this.useExistingThreatAgentQuestionnaireStatus) {
                                this.createNewThreatAgentsQuestionnaireStatus = false;

                                const questionnaireStatus: QuestionnaireStatusMgm = <QuestionnaireStatusMgm>response;

                                this.setCurrentQuestionnaireStatus(questionnaireStatus);

                                this.loadingQuestionnairesSemaphore = false;

                                this.router.navigate(['/identify-threat-agent/questionnaires/ID_THREAT_AGENT/questionnaire']);
                            }

                            break;
                        }
                        case QuestionnairePurpose.SELFASSESSMENT: {
                            if (this.showCompletionPercentages) {
                                this.showCompletionPercentages = false;

                                response = <HttpResponse<AssessVulnerabilitiesCompletionDTO>[]>response;

                                if (response && response.length) {
                                    response.forEach((value: HttpResponse<AssessVulnerabilitiesCompletionDTO>) => {
                                        const completion = value.body;

                                        this.assessVulnerabilitiesCompletionMap.set(completion.questionnaireStatusID, completion);
                                    });
                                }
                            }

                            this.loadingQuestionnairesSemaphore = false;
                            break;
                        }
                    }
                }
            ));
        }
    }

    setCurrentQuestionnaireStatus(questionnaireStatus: QuestionnaireStatusMgm) {
        switch (this.role) {
            case Role.ROLE_CISO: {
                this.dataSharingService.cisoQuestionnaireStatus = questionnaireStatus;
                this.dataSharingService.externalQuestionnaireStatus = questionnaireStatus.refinement;
                break;
            }
            case Role.ROLE_EXTERNAL_AUDIT: {
                this.dataSharingService.cisoQuestionnaireStatus = questionnaireStatus;
                this.dataSharingService.externalQuestionnaireStatus = questionnaireStatus.refinement;
                break;
            }
        }
    }

    createNewQuestionnaireStatus() {
        let questionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>> = null;

        switch (this.purpose) {
            case QuestionnairePurpose.ID_THREAT_AGENT: {
                break;
            }
            case QuestionnairePurpose.SELFASSESSMENT: {
                const questionnaire: QuestionnaireMgm = this.questionnaire;
                const questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.EMPTY, undefined,
                    undefined, this.myCompany.companyProfile, questionnaire, this.role, this.user, [], undefined, undefined);

                questionnaireStatus$ = this.questionnaireStatusService.create(questionnaireStatus);

                break;
            }
        }

        if (questionnaireStatus$) {
            this.subscriptions.push(questionnaireStatus$.subscribe((response: HttpResponse<QuestionnaireStatusMgm>) => {
                if (this.account && this.user && this.myCompany && this.myCompany.companyProfile) {
                    this.loadQuestionnaireStatuses();
                }
            }));
        }
    }

    registerChangeInQuestionnaireStatuses() {
        if (!this.questionnaireStatusesChangeEventSubscription) {
            this.questionnaireStatusesChangeEventSubscription = this.eventManagerService.observe(EventType.QUESTIONNAIRE_STATUS_LIST_UPDATE)
                .subscribe(
                    (event: Event) => {
                        console.log('Event: ');
                        console.log(event);

                        if (this.account && this.user && this.myCompany && this.myCompany.companyProfile) {
                            this.loadQuestionnaireStatuses();
                        }
                    });

            this.subscriptions.push(this.questionnaireStatusesChangeEventSubscription);
        }
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }

    onExternalChange(id: number, old: User, current: User) {
        this.externalChangedMap.set(id, true);
    }

    updateQuestionnaireStatus(questionnaireStatus: QuestionnaireStatusMgm) {
        this.questionnaireStatusService.update(questionnaireStatus).toPromise().then((response: HttpResponse<QuestionnaireStatusMgm>) => {
            if (response) {
                this.externalChangedMap.set(questionnaireStatus.id, false);
            }
        });
    }

    ngOnDestroy() {
        this.changeDetector.detach();

        if (this.subscriptions) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
