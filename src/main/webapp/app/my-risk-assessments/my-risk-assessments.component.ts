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
import { Principal } from './../shared/auth/principal.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../shared';
import { MyCompanyMgm } from '../entities/my-company-mgm';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../entities/self-assessment-mgm';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MyAssetMgm, MyAssetMgmService } from '../entities/my-asset-mgm';
import { DatasharingService } from '../datasharing/datasharing.service';
import { PopUpService } from '../shared/pop-up-services/pop-up.service';
import { MyRole } from '../entities/enumerations/MyRole.enum';

interface OrderBy {
    name: boolean;
    created: boolean;
    modified: boolean;
    type: string;
}

@Component({
    selector: 'jhi-my-risk-assessments',
    templateUrl: './my-risk-assessments.component.html',
    styleUrls: ['./my-risk-assessment.component.css'],
})
export class MyRiskAssessmentsComponent implements OnInit, OnDestroy {

    private static NOT_FOUND = 404;
    private user: User;
    private myCompany: MyCompanyMgm;
    public mySelfAssessments: SelfAssessmentMgm[];
    eventSubscriber: Subscription;
    private subscription: Subscription;
    public isAuthenticated = false;
    public isAdmin = false;
    public isCISO = false;
    public isExternal = false;
    public mySelfAssessment = null;
    public orderBy: OrderBy;

    constructor(
        private router: Router,
        private selfAssessmentService: SelfAssessmentMgmService,
        private myAssetService: MyAssetMgmService,
        private dataSharingService: DatasharingService,
        public popUpService: PopUpService,
        private principal: Principal
    ) {
    }

    ngOnInit() {
        this.orderBy = {
            name: false,
            created: false,
            modified: false,
            type: 'desc'
        };
        this.loadMySelfAssessments();
        this.registerChangeInSelfAssessments();
        if (this.selfAssessmentService.isSelfAssessmentSelected()) {
            this.mySelfAssessment = this.selfAssessmentService.getSelfAssessment();
        } else {
            this.mySelfAssessment = null;
        }

        // Get notified each time authentication state changes.
        this.dataSharingService.observeRole().subscribe((role: MyRole) => {
            switch (role) {
                case MyRole.ROLE_ADMIN: {
                    this.isAdmin = true;
                    break;
                }
                case MyRole.ROLE_CISO: {
                    this.isCISO = true;
                    break;
                }
                case MyRole.ROLE_EXTERNAL_AUDIT: {
                    this.isExternal = true;
                    break;
                }
                case null: {
                    this.isAuthenticated = false;
                    this.isCISO = false;
                    this.isExternal = false;
                    this.isAdmin = false;
                }
            }
        });
    }

    private loadMySelfAssessments() {
        this.selfAssessmentService.getMySelfAssessments().toPromise().then(
            (response: SelfAssessmentMgm[]) => {
                this.mySelfAssessments = response;
            }
        );
    }

    selectSelfAssessment(selfAssessment: SelfAssessmentMgm) {
        this.selfAssessmentService.setSelfAssessment(selfAssessment);
        this.dataSharingService.updateMySelfAssessment(selfAssessment);

        if (this.isCISO) {
            this.router.navigate(['/']);
        }

        if (this.isExternal) {
            this.router.navigate(['/evaluate-weakness/questionnaires/SELFASSESSMENT']);
        }
    }

    trackId(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }

    registerChangeInSelfAssessments() {
        this.subscription = this.dataSharingService.observeMySelf().subscribe((value: SelfAssessmentMgm) => {
            this.loadMySelfAssessments();
        });
    }

    updateMyAsset(asset: MyAssetMgm) {
        this.myAssetService.update(asset).toPromise();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private resetOrder() {
        this.orderBy.name = false;
        this.orderBy.created = false;
        this.orderBy.modified = false;
        this.orderBy.type = 'desc';
    }

    public tableOrderBy(orderColumn: string, desc: boolean) {
        this.resetOrder();
        if (desc) {
            this.orderBy.type = 'desc';
        } else {
            this.orderBy.type = 'asc';
        }
        switch (orderColumn.toLowerCase()) {
            case ('name'): {
                this.orderBy.name = true;
                if (desc) {
                    this.mySelfAssessments = _.orderBy(this.mySelfAssessments, ['name'], ['desc']);
                } else {
                    this.mySelfAssessments = _.orderBy(this.mySelfAssessments, ['name'], ['asc']);
                }
                break;
            }
            case ('created'): {
                this.orderBy.created = true;
                if (desc) {
                    this.mySelfAssessments = _.orderBy(this.mySelfAssessments, ['created'], ['desc']);
                } else {
                    this.mySelfAssessments = _.orderBy(this.mySelfAssessments, ['created'], ['asc']);
                }
                break;
            }
            case ('modified'): {
                this.orderBy.modified = true;
                if (desc) {
                    this.mySelfAssessments = _.orderBy(this.mySelfAssessments, ['modified'], ['desc']);
                } else {
                    this.mySelfAssessments = _.orderBy(this.mySelfAssessments, ['modified'], ['asc']);
                }
                break;
            }
        }
    }
}
