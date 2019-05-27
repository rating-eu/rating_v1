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
import {Component, OnDestroy, OnInit} from '@angular/core';
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

@Component({
    selector: 'jhi-questionnaires',
    templateUrl: './questionnaires.component.html',
    styles: []
})
export class QuestionnairesComponent implements OnInit, OnDestroy {

    public statusEnum = Status;
    public roleEnum = Role;
    public purposeEnum = QuestionnairePurpose;
    public purpose: QuestionnairePurpose;

    private static CISO_ROLE: string = Role[Role.ROLE_CISO];
    private static EXTERNAL_ROLE: string = Role[Role.ROLE_EXTERNAL_AUDIT];

    private questionnaire$: Observable<QuestionnaireMgm>;
    private questionnaire: QuestionnaireMgm;

    private externalAudits$: Observable<User[]>;
    private externalAudits: User[];

    private identifyThreatAgentsQuestionnaire: QuestionnaireMgm;
    private selfAssessmentQuestionnaire: QuestionnaireMgm;

    public questionnaireStatuses$: Observable<QuestionnaireStatusMgm[]>;
    private questionnaireStatuses: QuestionnaireStatusMgm[];

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
                private completionService: CompletionDtoService
    ) {
    }

    ngOnInit() {
        console.log('Questionnaires ON INIT:');

        this.myCompany = this.dataSharingService.myCompany;

        if(this.myCompany && this.myCompany.companyProfile){
            this.registerChangeInQuestionnaireStatuses();
            this.loadQuestionnaire();
        }

        this.subscriptions.push(this.dataSharingService.myCompanyObservable.subscribe((response: MyCompanyMgm) => {
            this.myCompany = response;

            if(this.myCompany && this.myCompany.companyProfile){
                this.registerChangeInQuestionnaireStatuses();
                this.loadQuestionnaire();
            }
        }));

        this.externalChangedMap = new Map();
        this.assessVulnerabilitiesCompletionMap = new Map();
    }

    private loadQuestionnaire() {
        const params$ = this.route.params;

        // GET the questionnaires by purpose
        const join$ = params$.pipe(
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
                this.externalAudits$ = this.userService.getExternalAudits();

                return forkJoin(this.questionnaire$, this.externalAudits$);
            })
        );

        // GET the account
        this.account$ = join$.pipe(
            switchMap((response: [QuestionnaireMgm, User[]]) => {
                this.questionnaire = response[0];
                this.externalAudits = response[1];

                switch (this.purpose) {
                    case QuestionnairePurpose.SELFASSESSMENT:{
                        this.selfAssessmentQuestionnaire = this.questionnaire;
                    }
                    case QuestionnairePurpose.ID_THREAT_AGENT:{
                        this.identifyThreatAgentsQuestionnaire = this.questionnaire;
                    }
                }

                return this.accountService.get();
            })
        );

        // GET the user
        this.user$ = this.account$.pipe(switchMap(
            (response: HttpResponse<Account>) => {
                this.account = response.body;

                if (this.account['authorities'].includes(QuestionnairesComponent.CISO_ROLE)) {
                    this.role = Role.ROLE_CISO;
                } else if (this.account['authorities'].includes(QuestionnairesComponent.EXTERNAL_ROLE)) {
                    this.role = Role.ROLE_EXTERNAL_AUDIT;
                }

                return this.userService.find(this.account['login']);
            }
        ));

        this.questionnaireStatuses$ = this.user$.pipe(
            switchMap((response: HttpResponse<User>) => {
                this.user = response.body;

                // TODO switch user's role, if external get by external field.
                return this.questionnaireStatusService.getAllQuestionnaireStatusesByCurrentUserAndQuestionnairePurpose(this.purpose);
            })
        );

        this.questionnaireStatuses$.subscribe(
            (response: QuestionnaireStatusMgm[]) => {
                this.questionnaireStatuses = response;

                console.log("Questionnaire Statuses:");
                console.log(this.questionnaireStatuses);

                if (this.questionnaireStatuses.length === 0) {
                    console.log("This.Purpose:");
                    console.log(this.purpose);

                    console.log("ID ThreatAgent:");
                    console.log(QuestionnairePurpose.ID_THREAT_AGENT);

                    console.log("SelfAssessment:");
                    console.log(QuestionnairePurpose.SELFASSESSMENT);

                    switch (this.purpose) {
                        case QuestionnairePurpose.ID_THREAT_AGENT: {
                            // Create the first QuestionnaireStatus
                            let questionnaireStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined,
                                Status.EMPTY, undefined, undefined, this.myCompany.companyProfile,
                                this.identifyThreatAgentsQuestionnaire, this.role, this.user, [], undefined, undefined);

                            this.questionnaireStatusService.create(questionnaireStatus).subscribe(
                                (response: HttpResponse<QuestionnaireStatusMgm>) => {
                                    if (response) {
                                        questionnaireStatus = response.body;
                                        this.questionnaireStatuses.push(response.body);

                                        this.setCurrentQuestionnaireStatus(questionnaireStatus);
                                        this.router.navigate(['/identify-threat-agent/questionnaires/ID_THREAT_AGENT/questionnaire']);
                                    }
                                }
                            );

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

                                    join$.subscribe((response: HttpResponse<AssessVulnerabilitiesCompletionDTO>[]) => {
                                        if(response && response.length){
                                            response.forEach((value: HttpResponse<AssessVulnerabilitiesCompletionDTO>) => {
                                                const completion = value.body;

                                                this.assessVulnerabilitiesCompletionMap.set(completion.questionnaireStatusID, completion);
                                            });
                                        }
                                    });
                                }
                            }
                            break;
                        }
                    }
                }
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
            questionnaireStatus$.subscribe((response: HttpResponse<QuestionnaireStatusMgm>) => {
                this.loadQuestionnaire();
            });
        }
    }

    registerChangeInQuestionnaireStatuses() {

        this.subscriptions.push(this.eventManagerService.observe('questionnaireStatusListModification')
            .subscribe(
                (response) => {
                    this.loadQuestionnaire();
                })
        );
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }

    onExternalChange(id: number, old: User, current: User) {
        this.externalChangedMap.set(id, true);
    }

    updateQuestionnaireStatus(questionnaireStatus: QuestionnaireStatusMgm) {
        this.questionnaireStatusService.update(questionnaireStatus).subscribe((response: HttpResponse<QuestionnaireStatusMgm>) => {
            if (response) {
                this.externalChangedMap.set(questionnaireStatus.id, false);
            }
        });
    }
}
