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

import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {CriticalAttackStrategyService} from "../models/critical-attack-strategy.service";
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {CriticalAttackStrategy} from "../models/critical-attack-strategy.model";
import * as _ from 'lodash';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {Observable, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {Router} from "@angular/router";
import {of} from "rxjs/observable/of";

export enum CriticalAttackStrategyField {
    'ATTACK_STRATEGY' = <any>'ATTACK_STRATEGY',
    'TARGET_ASSETS' = <any>'TARGET_ASSETS',
    'CRITICALITY' = <any>'CRITICALITY',
    'AWARENESS' = <any>'AWARENESS',
    'SOC' = <any>'SOC',
    'ALERT' = <any>'ALERT',
}

@Component({
    selector: 'jhi-most-critical-attack-strategies-widget',
    templateUrl: './most-critical-attack-strategies-widget.component.html',
    styleUrls: ['most-critical-attack-strategies-widget.component.css']
})
export class MostCriticalAttackStrategiesWidgetComponent implements OnInit, OnDestroy {
    public isCollapsed = true;
    public loading = false;
    public casFieldEnum = CriticalAttackStrategyField;
    public showAttackInfo = new Map();
    private subscriptions: Subscription[];

    /**
     * Map to keep the sorting status of the fields of the CriticalAttackStrategies.
     * The key is its field, while the value is a number,
     * equal to -1 if sorted in descending mode,
     * 0 if not sorted at all, and 1 if sorted in ascending mode.
     */
    public sortingStatusMap: Map<CriticalAttackStrategyField, number>;

    public attackStrategiesPaginator = {
        id: 'critical_attack_strategies_paginator',
        itemsPerPage: 7,
        currentPage: 1
    };

    private selfAssessment: SelfAssessmentMgm;
    public criticalAttackStrategies: CriticalAttackStrategy[];

    constructor(
        private selfAssessmentService: SelfAssessmentMgmService,
        private criticalAttackStrategyService: CriticalAttackStrategyService,
        private dataSharingService: DatasharingService,
        private changeDetector: ChangeDetectorRef,
        private router: Router) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.sortingStatusMap = new Map();
        this.selfAssessment = this.dataSharingService.selfAssessment;

        if (!this.selfAssessment) {
            this.router.navigate(['/my-risk-assessments']);
        } else {
            this.fetchCriticalAttackStrategies()
                .catch(err => {
                    return of([]);
                })
                .toPromise()
                .then((response: CriticalAttackStrategy[]) => {
                    this.handleAttackStrategiesUpdate(response);
                });
        }

        this.subscriptions.push(
            this.dataSharingService.selfAssessmentObservable.pipe(
                switchMap((newAssessment: SelfAssessmentMgm) => {
                    if (newAssessment) {
                        // Check if there is no self assessment or if it has changed
                        if (!this.selfAssessment || this.selfAssessment.id !== newAssessment.id) {
                            this.selfAssessment = newAssessment;

                            return this.fetchCriticalAttackStrategies()
                                .catch(err => {
                                    return of([]);
                                });
                        } else {
                            return of([]);
                        }
                    } else {
                        return of([]);
                    }
                })
            ).subscribe(
                (response: CriticalAttackStrategy[]) => {
                    if (response && response.length) {
                        this.handleAttackStrategiesUpdate(response);
                    }
                }
            )
        );
    }

    private fetchCriticalAttackStrategies(): Observable<CriticalAttackStrategy[]> {
        return this.criticalAttackStrategyService
            .getCriticalAttackStrategies(this.selfAssessment.id);
    }

    private handleAttackStrategiesUpdate(response: CriticalAttackStrategy[]) {
        this.criticalAttackStrategies = response;

        if(this.changeDetector && !(this.changeDetector as ViewRef).destroyed){
            this.changeDetector.detectChanges();
        }
    }

    onAttackStrategiesPageChange(number: number) {
        this.attackStrategiesPaginator.currentPage = number;
    }

    orderTableBy(field: CriticalAttackStrategyField, desc: boolean) {
        switch (field) {
            case CriticalAttackStrategyField.ATTACK_STRATEGY: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.attackStrategy.name, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.ATTACK_STRATEGY, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.attackStrategy.name, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.ATTACK_STRATEGY, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.TARGET_ASSETS: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.targetAssets, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.TARGET_ASSETS, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.targetAssets, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.TARGET_ASSETS, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.CRITICALITY: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.criticalityPercentage, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.CRITICALITY, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.criticalityPercentage, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.CRITICALITY, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.AWARENESS: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.awarenessCriticalityPercentage, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.AWARENESS, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.awarenessCriticalityPercentage, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.AWARENESS, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.SOC: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.socCriticalityPercentage, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.SOC, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.socCriticalityPercentage, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.SOC, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.ALERT: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.alertPercentage, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.ALERT, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.alertPercentage, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.ALERT, 1);
                }

                break;
            }
        }
    }

    toggleInfo(attackStrategyID: number) {
        if (this.showAttackInfo.has(attackStrategyID)) {
            const status: boolean = this.showAttackInfo.get(attackStrategyID);

            this.showAttackInfo.set(attackStrategyID, !status);
        } else {
            this.showAttackInfo.set(attackStrategyID, true);
        }
    }

    ngOnDestroy(): void {
        this.changeDetector.detach();

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach(subscription => {
                subscription.unsubscribe();
            });
        }
    }
}
