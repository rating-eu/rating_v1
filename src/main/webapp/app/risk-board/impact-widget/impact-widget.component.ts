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
import {RiskBoardStepEnum} from '../../entities/enumerations/RiskBoardStep.enum';
import {RiskBoardService, RiskBoardStatus} from '../risk-board.service';
import {ImpactEvaluationService} from './../../impact-evaluation/impact-evaluation.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {SelfAssessmentMgmService, SelfAssessmentMgm} from '../../entities/self-assessment-mgm';
import {MyAssetMgm} from '../../entities/my-asset-mgm';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {switchMap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import {of} from "rxjs/observable/of";

interface OrderBy {
    impact: boolean;
    from: boolean;
    to: boolean;
    type: string;
}

interface WidgetItem {
    impact: number;
    economicValueMin: number;
    economicValueMax: number;
    assets: MyAssetMgm[];
}

@Component({
    selector: 'jhi-impact-widget',
    templateUrl: './impact-widget.component.html',
    styleUrls: ['impact-widget.component.css']
})
export class ImpactWidgetComponent implements OnInit, OnDestroy {
    public loading = false;
    public isCollapsed = true;
    public widgetElements: WidgetItem[] = [];
    public selectedImpact: number;
    public orderBy: OrderBy;

    private selfAssessment: SelfAssessmentMgm;
    private dashboardStatus = RiskBoardStepEnum;
    private myAssets: MyAssetMgm[] = [];
    private subscriptions: Subscription[];

    constructor(
        private impactService: ImpactEvaluationService,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private dashService: RiskBoardService,
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.loading = true;
        this.selfAssessment = this.dataSharingService.selfAssessment;
        this.orderBy = {
            impact: false,
            from: false,
            to: false,
            type: 'desc'
        };

        if (this.selfAssessment) {
            this.impactService.getMyAssets(this.selfAssessment)
                .toPromise()
                .then(
                    (myAssets: MyAssetMgm[]) => {
                        this.handleMyAssets(myAssets);
                    },
                    (error) => {
                        this.loading = false;
                    }
                )
        }

        this.subscriptions.push(
            this.dataSharingService.selfAssessmentObservable.pipe(
                switchMap((newAssessment: SelfAssessmentMgm) => {
                    if (newAssessment) {
                        // Check if there is no self assessment or if it has changed
                        if (!this.selfAssessment || this.selfAssessment.id !== newAssessment.id) {
                            this.selfAssessment = newAssessment;

                            return this.impactService.getMyAssets(this.selfAssessment)
                                .catch((err) => {
                                    return of(null);
                                });
                        }
                    } else {
                        return of(null);
                    }
                })
            ).subscribe((myAssets: MyAssetMgm[]) => {
                    this.handleMyAssets(myAssets);
                },
                (error) => {
                    this.loading = false;
                }
            )
        );
    }

    private resetOrder() {
        this.orderBy.from = false;
        this.orderBy.to = false;
        this.orderBy.impact = false;
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
            case ('impact'): {
                this.orderBy.impact = true;
                if (desc) {
                    this.widgetElements = _.orderBy(this.widgetElements, ['impact'], ['desc']);
                } else {
                    this.widgetElements = _.orderBy(this.widgetElements, ['impact'], ['asc']);
                }
                break;
            }
            case ('from'): {
                this.orderBy.from = true;
                if (desc) {
                    this.widgetElements = _.orderBy(this.widgetElements, ['economicValueMin'], ['desc']);
                } else {
                    this.widgetElements = _.orderBy(this.widgetElements, ['economicValueMin'], ['asc']);
                }
                break;
            }
            case ('to'): {
                this.orderBy.to = true;
                if (desc) {
                    this.widgetElements = _.orderBy(this.widgetElements, ['economicValueMax'], ['desc']);
                } else {
                    this.widgetElements = _.orderBy(this.widgetElements, ['economicValueMax'], ['asc']);
                }
                break;
            }
        }
    }

    public setImpact(impact: number) {
        if (this.selectedImpact === null) {
            this.selectedImpact = impact;
        } else {
            if (this.selectedImpact === impact) {
                this.selectedImpact = null;
            } else {
                this.selectedImpact = impact;
            }
        }
    }

    private handleMyAssets(myAssets: MyAssetMgm[]) {
        if (myAssets && myAssets.length > 0) {
            this.myAssets = myAssets;
            this.myAssets.forEach((value, counter, array) => {
                if (this.widgetElements.length === 0) {
                    const element = {
                        impact: value.impact,
                        economicValueMin: value.economicImpact,
                        economicValueMax: value.economicImpact,
                        assets: [value]
                    };
                    this.widgetElements.push(_.cloneDeep(element));
                } else {
                    const index = _.findIndex(this.widgetElements, {impact: value.impact});
                    if (index !== -1) {
                        this.widgetElements[index].economicValueMin = this.widgetElements[index].economicValueMin < value.economicImpact ?
                            this.widgetElements[index].economicValueMin : value.economicImpact;
                        this.widgetElements[index].economicValueMax = this.widgetElements[index].economicValueMax > value.economicImpact ?
                            this.widgetElements[index].economicValueMax : value.economicImpact;
                        this.widgetElements[index].assets.push(_.cloneDeep(value));
                        this.widgetElements[index].assets = _.orderBy(this.widgetElements[index].assets, ['economicImpact'], ['desc']);
                    } else {
                        const element = {
                            impact: value.impact,
                            economicValueMin: value.economicImpact,
                            economicValueMax: value.economicImpact,
                            assets: [value]
                        };
                        this.widgetElements.push(_.cloneDeep(element));
                    }
                }
                if (counter === array.length - 1) {
                    for (let i = 1; i <= 5; i++) {
                        const iIndex = _.findIndex(this.widgetElements, {impact: i});
                        if (iIndex === -1) {
                            const emptyElement = {
                                impact: i,
                                economicValueMin: undefined,
                                economicValueMax: undefined,
                                assets: []
                            };
                            this.widgetElements.push(_.cloneDeep(emptyElement));
                        }
                    }
                    this.widgetElements = _.orderBy(this.widgetElements, ['impact'], ['desc']);
                }
            });
            this.loading = false;
        } else {
            this.loading = false;
        }
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach(subscription => {
                subscription.unsubscribe();
            });
        }
    }
}
