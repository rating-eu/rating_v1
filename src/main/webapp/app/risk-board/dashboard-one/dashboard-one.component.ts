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

import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Principal} from '../../shared';
import {SelfAssessmentMgm} from '../../entities/self-assessment-mgm';
import {DataSharingService} from '../../data-sharing/data-sharing.service';
import {Router} from '@angular/router';
import {ImpactMode} from '../../entities/enumerations/ImpactMode.enum';
import {RiskBoardStatus} from '../risk-board.service';
import {Status} from '../../entities/enumerations/Status.enum';
import {Subscription} from "rxjs";
import {of} from "rxjs/observable/of";

@Component({
    selector: 'jhi-dashboard-one',
    templateUrl: './dashboard-one.component.html',
    styleUrls: ['dashboard-one.component.css']
})
export class DashboardOneComponent implements OnInit, OnDestroy {
    public selfAssessment: SelfAssessmentMgm = null;
    public impactModeEnum = ImpactMode;
    public statusEnum = Status;
    public riskBoardStatus: RiskBoardStatus = null;
    private subscriptions: Subscription[];


    constructor(
        private principal: Principal,
        private datasharingService: DataSharingService,
        private router: Router,
        private changDetector: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.selfAssessment = this.datasharingService.selfAssessment;
        this.riskBoardStatus = this.datasharingService.riskBoardStatus;

        if (!this.selfAssessment) {
            this.router.navigate(['/my-risk-assessments']);
        }

        this.subscriptions.push(
            this.datasharingService.selfAssessment$
                .catch((err) => {
                    this.selfAssessment = null;
                    return of(null);
                })
                .subscribe(assessment => {

                    if (assessment) {
                        this.selfAssessment = assessment;
                    } else {
                        this.selfAssessment = null;
                    }

                    if (!this.selfAssessment) {
                        this.router.navigate(['/my-risk-assessments']);
                    }
                })
        );


        this.subscriptions.push(
            this.datasharingService.riskBoardStatus$
                .catch((err) => {

                    const status: RiskBoardStatus = new RiskBoardStatus();
                    return of(status);
                }).subscribe(
                (status: RiskBoardStatus) => {
                    this.riskBoardStatus = status;
                    this.changDetector.detectChanges();
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.changDetector.detach();

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
