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
import {QuestionnairesService} from '../../questionnaires.service';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionnairePurpose} from '../../../entities/enumerations/QuestionnairePurpose.enum';
import {SelfAssessmentMgm} from '../../../entities/self-assessment-mgm';
import {User} from '../../../shared';
import {QuestionnaireStatusMgm} from '../../../entities/questionnaire-status-mgm';
import {ContainerType} from '../../../entities/enumerations/ContainerType.enum';
import {Subscription} from 'rxjs';
import {DataSharingService} from '../../../data-sharing/data-sharing.service';

@Component({
    selector: 'jhi-questionnaire',
    templateUrl: './questionnaire.component.html',
    styles: [],
})
export class QuestionnaireComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];

    questionnaireStatus: QuestionnaireStatusMgm;
    purposeEnum = QuestionnairePurpose;
    selfAssessment: SelfAssessmentMgm;
    account: Account;
    user: User;

    public containerType: ContainerType;
    public areaID: number;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private questionnairesService: QuestionnairesService,
        private dataSharingService: DataSharingService) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.questionnaireStatus = this.dataSharingService.cisoQuestionnaireStatus;

        if (!this.questionnaireStatus || !this.questionnaireStatus.questionnaire) {
            this.router.navigate(['/']);
        }

        this.subscriptions.push(
            this.route.params.subscribe(
                (params) => {
                    if (params["container-type"] && params["area-id"]) {
                        const cType: string = params['container-type'];
                        this.areaID = Number(params['area-id']);

                        switch (cType) {
                            case ContainerType[ContainerType.HUMAN]: {
                                this.containerType = ContainerType.HUMAN;
                                break;
                            }
                            case ContainerType[ContainerType.IT]: {
                                this.containerType = ContainerType.IT;
                                break;
                            }
                            case ContainerType[ContainerType.PHYSICAL]: {
                                this.containerType = ContainerType.PHYSICAL;
                                break;
                            }
                        }
                    }
                }
            )
        );
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach(subscription => {
                subscription.unsubscribe();
            });
        }
    }
}
