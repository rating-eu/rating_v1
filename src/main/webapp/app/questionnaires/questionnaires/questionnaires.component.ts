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
import {LocalStorageService} from 'ngx-webstorage';

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
                private evaluateWeaknessService: EvaluateService,
                private localStorage: LocalStorageService) {
    }

    ngOnInit() {
        console.log('Questionnaires ON INIT:');

        this.subscriptions.push(
            this.route.params.subscribe(
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

                    // this.questionnaires$ = this.questionnairesService.getAllQuestionnairesByPurpose(this.purpose);
                    this.questionnaires$ = null;
                    // In this version of the application we do not give the possibility to choose between multiple questionnaires
                    this.loadQuestionnaire();
                }
            )
        );
    }

    private async loadQuestionnaire() {
        const questionnaires = await this.questionnairesService.getAllQuestionnairesByPurpose(this.purpose).toPromise();
        console.log('Questionnaires: ');
        console.log(questionnaires);

        this.selfAssessment = await this.selfAssessmentService.getSelfAssessment();
        this.account = (await this.accountService.get().toPromise()).body;
        this.user = (await this.userService.find(this.account['login']).toPromise()).body;
        await this.setCurrentQuestionnaireAsyncVersion(questionnaires[0]);

        if (questionnaires) {
            this.dataSharingService.currentQuestionnaire = questionnaires[0];

            switch (this.purpose) {
                case QuestionnairePurpose.ID_THREAT_AGENT: {
                    this.router.navigate(['./identify-threat-agent/questionnaires/' + this.purpose + '/questionnaire']);
                    break;
                }
                case QuestionnairePurpose.SELFASSESSMENT: {
                    this.router.navigate(['./evaluate-weakness/questionnaires/' + this.purpose + '/questionnaire']);
                    break;
                }
            }
        }
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    async setCurrentQuestionnaireAsyncVersion(questionnaire: QuestionnaireMgm) {
        this.dataSharingService.currentQuestionnaire = questionnaire;
        this.localStorage.store('purpose', this.purpose);
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
                    })
            );
        } else {

        }

        this.dataSharingService.currentQuestionnaire = questionnaire;
    }
}
