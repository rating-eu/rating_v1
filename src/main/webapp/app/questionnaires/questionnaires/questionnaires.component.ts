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
import {AccountService, User, UserService} from '../../shared';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {QuestionnairePurpose} from '../../entities/enumerations/QuestionnairePurpose.enum';
import {MyAnswerMgmService} from '../../entities/my-answer-mgm';
import {IdentifyThreatAgentService} from '../../identify-threat-agent/identify-threat-agent.service';
import {EvaluateService} from '../../evaluate-weakness/evaluate-weakness.service';
import {LocalStorageService} from 'ngx-webstorage';
import {CompanyProfileMgm} from "../../entities/company-profile-mgm";
import {HttpResponse} from "@angular/common/http";
import {MyCompanyMgm, MyCompanyMgmService} from "../../entities/my-company-mgm";
import {switchMap} from "rxjs/operators";
import {Role} from "../../entities/enumerations/Role.enum";
import {PopUpService} from "../../shared/pop-up-services/pop-up.service";
import {JhiEventManager} from "ng-jhipster";
import {EventManagerService} from "../../datasharing/event-manager.service";

@Component({
    selector: 'jhi-questionnaires',
    templateUrl: './questionnaires.component.html',
    styles: []
})
export class QuestionnairesComponent implements OnInit, OnDestroy {

    public statusEnum = Status;
    public roleEnum = Role;
    public purposeEnum = QuestionnairePurpose;
    private purpose: QuestionnairePurpose;

    private static CISO_ROLE: string = Role[Role.ROLE_CISO];
    private static EXTERNAL_ROLE: string = Role[Role.ROLE_EXTERNAL_AUDIT];

    private questionnaires$: Observable<QuestionnaireMgm[]>;
    private questionnaires: QuestionnaireMgm[];

    private identifyThreatAgentsQuestionnaire: QuestionnaireMgm;
    private selfAssessmentQuestionnaire: QuestionnaireMgm;

    public questionnaireStatuses$: Observable<QuestionnaireStatusMgm[]>;
    private questionnaireStatuses: QuestionnaireStatusMgm[];

    private companyProfile: CompanyProfileMgm;

    private myCompany$: Observable<HttpResponse<MyCompanyMgm>>;
    private myCompany: MyCompanyMgm;

    private account$: Observable<HttpResponse<Account>>;
    private account: Account;
    private role: Role;

    private user$: Observable<HttpResponse<User>>;
    private user: User;

    private subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private myCompanyService: MyCompanyMgmService,
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
                private eventManagerService: EventManagerService
    ) {
    }

    ngOnInit() {
        console.log('Questionnaires ON INIT:');
        this.registerChangeInQuestionnaireStatuses();
        this.loadQuestionnaires();
    }

    private loadQuestionnaires() {
        const params$ = this.route.params;

        // GET the questionnaires by purpose
        this.questionnaires$ = params$.pipe(
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

                return this.questionnairesService.getAllQuestionnairesByPurpose(this.purpose);
            })
        );

        // GET the account
        this.account$ = this.questionnaires$.pipe(
            switchMap((response: QuestionnaireMgm[]) => {
                this.questionnaires = response;

                this.identifyThreatAgentsQuestionnaire = _.find(this.questionnaires, {'purpose': QuestionnairePurpose.ID_THREAT_AGENT});
                this.selfAssessmentQuestionnaire = _.find(this.questionnaires, {'purpose': QuestionnairePurpose.SELFASSESSMENT});

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

        // GET the MyCompany
        this.myCompany$ = this.user$.pipe(
            switchMap((response: HttpResponse<User>) => {
                this.user = response.body;

                return this.myCompanyService.findByUser(this.user.id);
            })
        );


        this.questionnaireStatuses$ = this.myCompany$.pipe(
            switchMap((response: HttpResponse<MyCompanyMgm>) => {
                this.myCompany = response.body;
                this.companyProfile = this.myCompany.companyProfile;

                return this.questionnairesService.getQuestionnaireStatusesByCompanyProfileQuestionnairePurposeAndUser(this.companyProfile, this.purpose, this.user);
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
                                this.identifyThreatAgentsQuestionnaire, this.role, this.user, []);

                            this.questionnaireStatusService.create(questionnaireStatus).subscribe(
                                (response: HttpResponse<QuestionnaireStatusMgm>) => {
                                    if (response) {
                                        questionnaireStatus = response.body;
                                        this.questionnaires.push(response.body);

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
                this.dataSharingService.externalQuestionnaireStatus = questionnaireStatus;
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
                const questionnaire: QuestionnaireMgm = this.questionnaires[0];
                const questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.EMPTY, undefined, undefined, this.companyProfile, questionnaire, this.role, this.user, []);

                questionnaireStatus$ = this.questionnaireStatusService.create(questionnaireStatus);

                break;
            }
        }

        if (questionnaireStatus$) {
            questionnaireStatus$.subscribe((response: HttpResponse<QuestionnaireStatusMgm>) => {
                this.loadQuestionnaires();
            });
        }
    }

    registerChangeInQuestionnaireStatuses() {

        this.subscriptions.push(this.eventManagerService.observe('questionnaireStatusListModification')
            .subscribe(
                (response) => {
                    this.loadQuestionnaires();
                })
        );
    }
}
