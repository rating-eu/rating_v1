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
import {Principal} from './../shared/auth/principal.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {MyAssetMgmService} from '../entities/my-asset-mgm';
import {DatasharingService} from '../datasharing/datasharing.service';
import {PopUpService} from '../shared/pop-up-services/pop-up.service';
import {Role} from '../entities/enumerations/Role.enum';
import {EventManagerService} from '../datasharing/event-manager.service';
import {EventType} from '../entities/enumerations/EventType.enum';
import {Event} from '../datasharing/event.model';

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
    public mySelfAssessments: SelfAssessmentMgm[];
    eventSubscriber: Subscription;
    private subscriptions: Subscription[];
    public isAuthenticated = false;
    public isAdmin = false;
    public isCISO = false;
    public isExternal = false;
    public mySelfAssessment = null;
    public orderBy: OrderBy;
    public isCollapsed: boolean = true;

    constructor(
        private router: Router,
        private selfAssessmentService: SelfAssessmentMgmService,
        private myAssetService: MyAssetMgmService,
        private dataSharingService: DatasharingService,
        private eventManagerService: EventManagerService,
        public popUpService: PopUpService,
        private principal: Principal
    ) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.orderBy = {
            name: false,
            created: false,
            modified: false,
            type: 'desc'
        };
        this.loadMySelfAssessments();
        this.registerChangeInSelfAssessments();
        this.mySelfAssessment = this.dataSharingService.selfAssessment;

        // Get notified each time authentication state changes.
        this.subscriptions.push(
            this.dataSharingService.role$.subscribe((role: Role) => {
                switch (role) {
                    case Role.ROLE_ADMIN: {
                        this.isAdmin = true;
                        break;
                    }
                    case Role.ROLE_CISO: {
                        this.isCISO = true;
                        break;
                    }
                    case Role.ROLE_EXTERNAL_AUDIT: {
                        this.isExternal = true;
                        break;
                    }
                    default: {
                        this.isAuthenticated = false;
                        this.isCISO = false;
                        this.isExternal = false;
                        this.isAdmin = false;
                    }
                }
            })
        );
    }

    private loadMySelfAssessments() {
        this.selfAssessmentService.getMySelfAssessments().toPromise().then(
            (response: SelfAssessmentMgm[]) => {
                this.mySelfAssessments = response;
            }
        );
    }

    selectSelfAssessment(selfAssessment: SelfAssessmentMgm) {
        this.dataSharingService.selfAssessment = selfAssessment;

        if (this.isCISO) {
            this.router.navigate(['/riskboard']);
        }

        if (this.isExternal) {
            this.router.navigate(['/evaluate-weakness/questionnaires/SELFASSESSMENT']);
        }
    }

    trackId(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }

    registerChangeInSelfAssessments() {
        this.subscriptions.push(
            this.dataSharingService.selfAssessment$.subscribe((value: SelfAssessmentMgm) => {
                this.loadMySelfAssessments();
            })
        );

        this.subscriptions.push(
            this.eventManagerService.observe(EventType.RISK_ASSESSMENT_LIST_UPDATE).subscribe(
                (event: Event) => {
                    this.loadMySelfAssessments();
                }
            )
        )
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
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
