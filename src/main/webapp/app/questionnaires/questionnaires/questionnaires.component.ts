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
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
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
import {HttpResponse} from "@angular/common/http";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {switchMap} from "rxjs/operators";
import {Role} from "../../entities/enumerations/Role.enum";
import {PopUpService} from "../../shared/pop-up-services/pop-up.service";
import {EventManagerService} from "../../datasharing/event-manager.service";
import {forkJoin} from "rxjs/observable/forkJoin";
import {AssessVulnerabilitiesCompletionDTO} from "../../dto/completion/assess-vulnerabilities-completion";
import {CompletionDtoService} from "../../dto/completion/completion-dto.service";
import {of} from "rxjs/observable/of";

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
        console.log('Questionnaires ON INIT:');
        this.canCreateNewQuestionnaireStatus = true;
        this.showCompletionPercentages = false;
        this.useExistingThreatAgentQuestionnaireStatus = false;
        this.createNewThreatAgentsQuestionnaireStatus = false;

        this.account = this.dataSharingService.account;
        this.user = this.dataSharingService.user;
        this.role = this.dataSharingService.role;
        this.myCompany = this.dataSharingService.myCompany;

        console.log("MyCompany:");
        console.log(this.myCompany);

        // Listen for when a new QuestionnaireStatus is created
        this.registerChangeInQuestionnaireStatuses();

        if (this.account && this.user && this.myCompany && this.myCompany.companyProfile) {
            this.loadQuestionnaireStatuses();
        }

        this.externalChangedMap = new Map();
        this.assessVulnerabilitiesCompletionMap = new Map();
    }

    private loadQuestionnaireStatuses() {
        console.log("Loading questionnaire");
        const params$ = this.route.params;

        // GET the questionnaires by purpose
        const questionnaireAndStatusesJoin$: Observable<[QuestionnaireMgm, QuestionnaireStatusMgm[]]> = params$.pipe(
            switchMap((params: Params) => {
                const routeQuestionnairePurpose = params['purpose'];
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

                this.questionnaire$ = this.questionnairesService.getQuestionnaireByPurposeAndCompanyType(this.purpose, this.myCompany.companyProfile.type);
                this.questionnaireStatuses$ = this.questionnaireStatusService.getAllQuestionnaireStatusesByCurrentUserAndQuestionnairePurpose(this.purpose);

                return forkJoin(this.questionnaire$, this.questionnaireStatuses$);
            })
        );

        const externalAudits$: Observable<User[] | null> = questionnaireAndStatusesJoin$.pipe(
            switchMap((response: [QuestionnaireMgm, QuestionnaireStatusMgm[]]) => {
                this.questionnaire = response[0];
                this.questionnaireStatuses = response[1];

                if (this.purpose === QuestionnairePurpose.SELFASSESSMENT && this.role === Role.ROLE_CISO) {
                    return this.userService.getExternalAuditsByCompanyProfile(this.myCompany.companyProfile.id);
                } else {
                    return of(null);
                }
            })
        );

        const howToProceed$: Observable<HttpResponse<QuestionnaireStatusMgm> | null | QuestionnaireStatusMgm | HttpResponse<AssessVulnerabilitiesCompletionDTO>[]> = externalAudits$.pipe(
            switchMap((response: User[] | null) => {
                    if (response) {
                        this.externalAudits = response;
                    } else {
                        this.externalAudits = [];
                    }

                    if (this.questionnaireStatuses.length === 0) {
                        switch (this.purpose) {
                            case QuestionnairePurpose.ID_THREAT_AGENT: {
                                // Create the first QuestionnaireStatus
                                const questionnaireStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined,
                                    Status.EMPTY, undefined, undefined, this.myCompany.companyProfile,
                                    this.questionnaire, this.role, this.user, [], undefined, undefined);

                                this.createNewThreatAgentsQuestionnaireStatus = true;
                                return this.questionnaireStatusService.create(questionnaireStatus);

                                /*this.subscriptions.push(this.questionnaireStatusService.create(questionnaireStatus).subscribe(
                                    (response: HttpResponse<QuestionnaireStatusMgm>) => {
                                        if (response) {
                                            questionnaireStatus = response.body;
                                            this.questionnaireStatuses.push(response.body);

                                            this.setCurrentQuestionnaireStatus(questionnaireStatus);
                                            this.router.navigate(['/identify-threat-agent/questionnaires/ID_THREAT_AGENT/questionnaire']);
                                        }
                                    }
                                ));

                                break*/
                            }
                            case QuestionnairePurpose.SELFASSESSMENT: {
                                return of(null);
                            }
                        }
                    } else {
                        switch (this.purpose) {
                            case QuestionnairePurpose.ID_THREAT_AGENT: {
                                switch (this.role) {
                                    case Role.ROLE_CISO: {

                                        const cisoIdentifyThreatAgentsQuestionnaireStatus: QuestionnaireStatusMgm =
                                            _.find(this.questionnaireStatuses, (value: QuestionnaireStatusMgm) => {

                                                if (value.role.valueOf() === Role.ROLE_CISO.valueOf() && value.user.id === this.user.id
                                                    && value.questionnaire.purpose.valueOf() === QuestionnairePurpose.ID_THREAT_AGENT.valueOf()) {

                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            });

                                        if (cisoIdentifyThreatAgentsQuestionnaireStatus) {
                                            this.useExistingThreatAgentQuestionnaireStatus = true;
                                            return of(cisoIdentifyThreatAgentsQuestionnaireStatus);
                                        } else {
                                            // Create the first QuestionnaireStatus
                                            const questionnaireStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined,
                                                Status.EMPTY, undefined, undefined, this.myCompany.companyProfile,
                                                this.questionnaire, this.role, this.user, [], undefined, undefined);

                                            this.createNewThreatAgentsQuestionnaireStatus = true;
                                            return this.questionnaireStatusService.create(questionnaireStatus);
                                        }
                                    }
                                }
                            }
                            case QuestionnairePurpose.SELFASSESSMENT: {
                                switch (this.role) {
                                    case Role.ROLE_CISO: {
                                        const completions$ = [];

                                        this.questionnaireStatuses.forEach((questionnaireStatus) => {
                                                completions$.push(
                                                    this.completionService
                                                        .getAssessVulnerabilitiesCompletionByCompanyProfileAndQuestionnaireStatus(this.myCompany.companyProfile.id, questionnaireStatus.id)
                                                );

                                                if (questionnaireStatus.status === Status.EMPTY || questionnaireStatus.status === Status.PENDING) {
                                                    this.canCreateNewQuestionnaireStatus = false;
                                                    this.changeDetector.detectChanges();
                                                }
                                            }
                                        );

                                        this.showCompletionPercentages = true;
                                        const join$: Observable<HttpResponse<AssessVulnerabilitiesCompletionDTO>[]> = forkJoin(completions$);

                                        return join$;
                                    }
                                }
                                break;
                            }
                        }
                    }

                    return null;
                }
            )
            )
        ;

        this.subscriptions.push(howToProceed$.subscribe(
            (response: HttpResponse<QuestionnaireStatusMgm> | null | QuestionnaireStatusMgm | HttpResponse<AssessVulnerabilitiesCompletionDTO>[]) => {

                console.log("Inside HOW TO PROCEED...");

                switch (this.purpose) {
                    case QuestionnairePurpose.ID_THREAT_AGENT: {
                        console.log("CASE THREAT AGENTS");

                        if (this.createNewThreatAgentsQuestionnaireStatus) {
                            this.createNewThreatAgentsQuestionnaireStatus = false;

                            const questionnaireStatus: QuestionnaireStatusMgm = (<HttpResponse<QuestionnaireStatusMgm>>response).body;
                            this.questionnaireStatuses.push(questionnaireStatus);

                            this.setCurrentQuestionnaireStatus(questionnaireStatus);
                            this.router.navigate(['/identify-threat-agent/questionnaires/ID_THREAT_AGENT/questionnaire']);
                        } else if (this.useExistingThreatAgentQuestionnaireStatus) {
                            this.useExistingThreatAgentQuestionnaireStatus = false;

                            const questionnaireStatus: QuestionnaireStatusMgm = <QuestionnaireStatusMgm>response;

                            this.setCurrentQuestionnaireStatus(questionnaireStatus);
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

                        break;
                    }
                }
            }
        ));

        // GET The Questionnaire Statuses
        /*this.questionnaireStatuses$ = this.questionnaire$.pipe(
            switchMap((questionnaireResponse: QuestionnaireMgm) => {
                this.questionnaire = questionnaireResponse;

                // API handles if External or CISO
                return this.questionnaireStatusService.getAllQuestionnaireStatusesByCurrentUserAndQuestionnairePurpose(this.purpose);
            })
        );*/

        // GET the ExternalAudits if CISO or else []


        // GET the account
        /*this.account$ = this.questionnaire$.pipe(
            switchMap((response: QuestionnaireMgm) => {
                this.questionnaire = response;

                switch (this.purpose) {
                    case QuestionnairePurpose.SELFASSESSMENT: {
                        this.selfAssessmentQuestionnaire = this.questionnaire;
                    }
                    case QuestionnairePurpose.ID_THREAT_AGENT: {
                        this.identifyThreatAgentsQuestionnaire = this.questionnaire;
                    }
                }

                return this.accountService.get();
            })
        );*/

        // GET the user
        /*this.user$ = this.account$.pipe(switchMap(
            (response: HttpResponse<Account>) => {
                this.account = response.body;

                if (this.account['authorities'].includes(QuestionnairesComponent.CISO_ROLE)) {
                    this.role = Role.ROLE_CISO;

                    //this.questionnaire$ = this.questionnairesService.getQuestionnaireByPurposeAndCompanyType(this.purpose, this.myCompany.companyProfile.type);
                    this.externalAudits$ = this.userService.getExternalAuditsByCompanyProfile(this.myCompany.companyProfile.id);

                    this.subscriptions.push(this.externalAudits$.subscribe((response: User[]) => {
                        this.externalAudits = response;
                    }));
                } else if (this.account['authorities'].includes(QuestionnairesComponent.EXTERNAL_ROLE)) {
                    this.role = Role.ROLE_EXTERNAL_AUDIT;

                    this.externalAudits$ = of(null);
                    this.user$ = this.userService.find(this.account['login']);
                }


                return this.user$;
            }
        ));*/

        /*this.questionnaireStatuses$ = this.user$.pipe(
            switchMap((response: HttpResponse<User>) => {
                this.user = response.body;

                // API handles if External or CISO
                return this.questionnaireStatusService.getAllQuestionnaireStatusesByCurrentUserAndQuestionnairePurpose(this.purpose);
            })
        );*/

        /*this.subscriptions.push(this.questionnaireStatuses$.subscribe(
            (response: QuestionnaireStatusMgm[]) => {
                this.questionnaireStatuses = response;

                console.log("Questionnaire Statuses:");
                console.log(this.questionnaireStatuses);

                if (this.questionnaireStatuses.length === 0) {
                    switch (this.purpose) {
                        case QuestionnairePurpose.ID_THREAT_AGENT: {
                            // Create the first QuestionnaireStatus
                            let questionnaireStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined,
                                Status.EMPTY, undefined, undefined, this.myCompany.companyProfile,
                                this.identifyThreatAgentsQuestionnaire, this.role, this.user, [], undefined, undefined);

                            this.subscriptions.push(this.questionnaireStatusService.create(questionnaireStatus).subscribe(
                                (response: HttpResponse<QuestionnaireStatusMgm>) => {
                                    if (response) {
                                        questionnaireStatus = response.body;
                                        this.questionnaireStatuses.push(response.body);

                                        this.setCurrentQuestionnaireStatus(questionnaireStatus);
                                        this.router.navigate(['/identify-threat-agent/questionnaires/ID_THREAT_AGENT/questionnaire']);
                                    }
                                }
                            ));

                            break;
                        }
                        case QuestionnairePurpose.SELFASSESSMENT: {

                            break;
                        }
                    }
                } else {
                    switch (this.purpose) {
                        case QuestionnairePurpose.ID_THREAT_AGENT: {

                            switch (this.role) {
                                case Role.ROLE_CISO: {
                                    // TODO get the QuestionnaireStatus of the CISO
                                    const cisoIdentifyThreatAgentsQuestionnaireStatus: QuestionnaireStatusMgm =
                                        _.find(this.questionnaireStatuses, (value: QuestionnaireStatusMgm) => {

                                            if (value.role.valueOf() === Role.ROLE_CISO.valueOf() && value.user.id === this.user.id
                                                && value.questionnaire.purpose.valueOf() === QuestionnairePurpose.ID_THREAT_AGENT.valueOf()) {

                                                return true;
                                            } else {
                                                return false;
                                            }
                                        });

                                    if (cisoIdentifyThreatAgentsQuestionnaireStatus) {
                                        this.setCurrentQuestionnaireStatus(cisoIdentifyThreatAgentsQuestionnaireStatus);
                                        this.router.navigate(['/identify-threat-agent/questionnaires/ID_THREAT_AGENT/questionnaire']);
                                    }

                                    break;
                                }
                                case Role.ROLE_EXTERNAL_AUDIT: {
                                    break;
                                }
                            }

                            break;
                        }
                        case QuestionnairePurpose.SELFASSESSMENT: {
                            switch (this.role) {
                                case Role.ROLE_CISO: {
                                    const completions$ = [];

                                    this.questionnaireStatuses.forEach((questionnaireStatus) => {
                                            completions$.push(
                                                this.completionService
                                                    .getAssessVulnerabilitiesCompletionByCompanyProfileAndQuestionnaireStatus(this.myCompany.companyProfile.id, questionnaireStatus.id)
                                            );
                                        }
                                    );

                                    const join$: Observable<HttpResponse<AssessVulnerabilitiesCompletionDTO>[]> = forkJoin(completions$);

                                    this.subscriptions.push(join$.subscribe((response: HttpResponse<AssessVulnerabilitiesCompletionDTO>[]) => {
                                        if (response && response.length) {
                                            response.forEach((value: HttpResponse<AssessVulnerabilitiesCompletionDTO>) => {
                                                const completion = value.body;

                                                this.assessVulnerabilitiesCompletionMap.set(completion.questionnaireStatusID, completion);
                                            });
                                        }
                                    }));
                                }
                            }
                            break;
                        }
                    }


                }
            }
        ));*/
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    setCurrentQuestionnaireStatus(questionnaireStatus: QuestionnaireStatusMgm) {
        switch (this.role) {
            case Role.ROLE_CISO: {
                this.dataSharingService.cisoQuestionnaireStatus = questionnaireStatus;
                break;
            }
            case Role.ROLE_EXTERNAL_AUDIT: {
                //TODO Fix me: get also the QuestionnaireStatus of the CISO
                this.dataSharingService.cisoQuestionnaireStatus = questionnaireStatus;
                this.dataSharingService.externalQuestionnaireStatus = questionnaireStatus.refinement;
                break;
            }
        }
    }

    createNewQuestionnaireStatus() {
        let questionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>> = undefined;

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
                this.loadQuestionnaireStatuses();
            }));
        }
    }

    registerChangeInQuestionnaireStatuses() {
        if (!this.questionnaireStatusesChangeEventSubscription) {
            this.questionnaireStatusesChangeEventSubscription = this.eventManagerService.observe('questionnaireStatusListModification')
                .subscribe(
                    (response) => {
                        this.loadQuestionnaireStatuses();
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
}
