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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuestionnairesService} from '../questionnaires.service';
import {QuestionnaireMgm} from '../../entities/questionnaire-mgm';
import {Observable} from 'rxjs/Observable';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {QuestionnaireStatusMgm, QuestionnaireStatusMgmService, Role} from '../../entities/questionnaire-status-mgm';
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

@Component({
    selector: 'jhi-questionnaires',
    templateUrl: './questionnaires.component.html',
    styles: [],
})
export class QuestionnairesComponent implements OnInit, OnDestroy {

    private statusEnum = Status;
    private purposeEnum = QuestionnairePurpose;
    private purpose: QuestionnairePurpose;

    private static CISO_ROLE = Role[Role.ROLE_CISO];
    private static EXTERNAL_ROLE = Role[Role.ROLE_EXTERNAL_AUDIT];

    questionnaires$: Observable<QuestionnaireMgm[]>;
    questionnaires: QuestionnaireMgm[];

    questionnaireStatuses$: Observable<QuestionnaireStatusMgm[]>;
    private questionnaireStatuses: QuestionnaireStatusMgm[];
    //private questionnaireStatusesMap: Map<number, QuestionnaireStatusMgm>;

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
                private questionnaireStatusService: QuestionnaireStatusMgmService
    ) {
    }

    ngOnInit() {
        console.log('Questionnaires ON INIT:');

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

                // Build the Map Questionnaire ==> Status
                /*this.questionnaireStatusesMap = new Map<number, QuestionnaireStatusMgm>();
                this.questionnaireStatuses.forEach((questionnaireStatus: QuestionnaireStatusMgm) => {
                    this.questionnaireStatusesMap.set(questionnaireStatus.questionnaire.id, questionnaireStatus);
                });*/
            }
        );

        /*.subscribe(
        (params: Params) => {
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

            // TODO Check-Me
            this.questionnaires$ = this.questionnairesService.getAllQuestionnairesByPurpose(this.purpose);
            // In this version of the application we do not give the possibility to choose between multiple questionnaires
            // this.loadQuestionnaire();
        }
    )
);*/
    }

    /*private async loadQuestionnaire() {
        const questionnaires = await this.questionnairesService.getAllQuestionnairesByPurpose(this.purpose).toPromise();
        console.log('Questionnaires: ');
        console.log(questionnaires);

        this.account = (await this.accountService.get().toPromise()).body;
        this.user = (await this.userService.find(this.account['login']).toPromise()).body;

        if (this.user) {
            this.companyProfile = (await this.myCompanyService.findByUser(this.user.id).toPromise()).body.companyProfile;
        }

        await this.setCurrentQuestionnaireStatusAsyncVersion(questionnaires[0]);

        if (questionnaires) {
            this.dataSharingService.currentQuestionnaire = questionnaires[0];

            switch (this.purpose) {
                case QuestionnairePurpose.ID_THREAT_AGENT: {
                    //this.router.navigate(['./identify-threat-agent/questionnaires/' + this.purpose + '/questionnaire']);
                    this.router.navigate(['./identify-threat-agent/questionnaires/' + this.purpose]);
                    break;
                }
                case QuestionnairePurpose.SELFASSESSMENT: {
                    //this.router.navigate(['./evaluate-weakness/questionnaires/' + this.purpose + '/questionnaire']);
                    this.router.navigate(['./evaluate-weakness/questionnaires/' + this.purpose]);
                    break;
                }
            }
        }
    }*/

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    setCurrentQuestionnaireStatus(questionnaireStatus: QuestionnaireStatusMgm) {
        console.log("Set current QuestionnaireStatus");

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
        console.log("Create new questionnaire status...");

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
                this.ngOnInit();
            });
        }
    }
}
