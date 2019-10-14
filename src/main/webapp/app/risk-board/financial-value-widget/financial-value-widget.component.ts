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

import {SelfAssessmentMgm} from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import {ImpactEvaluationStatus} from "../../impact-evaluation/quantitative/model/impact-evaluation-status.model";
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImpactEvaluationService} from '../../impact-evaluation/impact-evaluation.service';
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {Observable, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs/observable/of";

@Component({
    selector: 'jhi-financial-value-widget',
    templateUrl: './financial-value-widget.component.html',
    styleUrls: ['financial-value-widget.component.css']
})
export class FinancialValueWidgetComponent implements OnInit, OnDestroy {
    public loading = false;
    public ide: number;
    public intangibleCapital: number;
    public physicalReturn: number;
    public financialReturn: number;

    private wp3Status: ImpactEvaluationStatus;
    private selfAssessment: SelfAssessmentMgm;

    private subscriptions: Subscription[];

    constructor(
        private impactService: ImpactEvaluationService,
        private dataSharingService: DataSharingService
    ) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.loading = true;
        this.selfAssessment = this.dataSharingService.selfAssessment;

        if (this.selfAssessment) {
            this.impactService.getStatus(this.selfAssessment).toPromise().then((status) => {
                this.handleStatus(status);
            }).catch(() => {
                this.loading = false;
            });
        }

        this.subscriptions.push(
            this.dataSharingService.selfAssessment$.pipe(
                switchMap((newAssessment: SelfAssessmentMgm) => {
                    if (newAssessment) {
                        // Check if there is no self assessment or if it has changed
                        if (!this.selfAssessment || this.selfAssessment.id !== newAssessment.id) {
                            this.selfAssessment = newAssessment;

                            return this.impactService.getStatus(this.selfAssessment)
                                .catch((err) => {
                                    return of(null);
                                });
                        } else {
                            return of(null);
                        }
                    } else {
                        return of(null);
                    }
                })
            ).subscribe(
                (status: ImpactEvaluationStatus) => {
                    this.handleStatus(status);
                },
                (error) => {
                    this.loading = false;
                }
            )
        );
    }

    private handleStatus(status) {
        if (status) {
            this.wp3Status = status;
            this.ide = this.wp3Status.economicResults.intangibleDrivingEarnings;
            this.intangibleCapital = this.wp3Status.economicResults.intangibleCapital;
            this.physicalReturn = this.wp3Status.economicCoefficients.physicalAssetsReturn;
            this.financialReturn = this.wp3Status.economicCoefficients.financialAssetsReturn;
            this.loading = false;
        } else {
            this.loading = false;
        }
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            })
        }
    }
}
