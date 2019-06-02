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

import {MyAssetRisk} from './../../risk-management/model/my-asset-risk.model';
import {MitigationMgm} from './../../entities/mitigation-mgm/mitigation-mgm.model';
import * as _ from 'lodash';
import {RiskManagementService} from './../../risk-management/risk-management.service';
import {SelfAssessmentMgm} from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import {MyAssetMgm} from './../../entities/my-asset-mgm/my-asset-mgm.model';
import {SelfAssessmentMgmService} from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {switchMap} from "rxjs/operators";
import {EmptyObservable} from "rxjs/observable/EmptyObservable";
import {Observable, Subscription} from "rxjs";
import {ImpactEvaluationStatus} from "../../impact-evaluation/quantitative/model/impact-evaluation-status.model";

interface RiskPercentageElement {
    asset: MyAssetMgm;
    critical: number;
    likelihood: number;
    vulnerability: number;
    percentage: number;
}

interface OrderBy {
    category: boolean;
    asset: boolean;
    description: boolean;
    impact: boolean;
    critical: boolean;
    likelihood: boolean;
    vulnerability: boolean;
    risk: boolean;
    type: string;
}

@Component({
    selector: 'jhi-asset-at-risk-widget',
    templateUrl: './asset-at-risk-widget.component.html',
    styleUrls: ['asset-at-risk-widget.component.css']
})
export class AssetAtRiskWidgetComponent implements OnInit, OnDestroy {
    public loadingRiskLevel = false;
    public loadingAssetsAndAttacks = false;
    public isCollapsed = true;
    private selfAssessment: SelfAssessmentMgm;
    public squareColumnElement: number[];
    public squareRowElement: number[];
    public lastSquareRowElement: number;
    public myAssetsAtRisk: MyAssetRisk[];
    public bostonSquareCells: string[][] = [];
    public riskMitigationMap: Map<number, MitigationMgm[]> = new Map<number, MitigationMgm[]>();
    public attackCosts = false;
    public assetsToolTip: Map<number, string> = new Map<number, string>();
    public assetToolTipLoaded = false;
    public risksTangible: RiskPercentageElement[] = [];
    public risksIntangible: RiskPercentageElement[] = [];
    public noRiskInMap = true;
    public assetToolTipLoadedTimer = false;
    public orderIntangibleBy: OrderBy;
    public orderTangibleBy: OrderBy;
    private subscriptions: Subscription[];

    public tangibleAssetAtRiskPaginator = {
        id: 'tangible_asset_at_risk_paginator',
        itemsPerPage: 7,
        currentPage: 1
    };
    public intangibleAssetAtRiskPaginator = {
        id: 'intangible_asset_at_risk_paginator',
        itemsPerPage: 7,
        currentPage: 1
    };

    constructor(
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private riskService: RiskManagementService,
        private dataSharingService: DatasharingService
    ) {
    }

    onIntangibleRiskPageChange(number: number) {
        this.intangibleAssetAtRiskPaginator.currentPage = number;
    }

    onTangibleRiskPageChange(number: number) {
        this.tangibleAssetAtRiskPaginator.currentPage = number;
    }

    ngOnInit() {
        this.subscriptions = [];
        this.loadingRiskLevel = true;
        this.loadingAssetsAndAttacks = true;
        this.orderIntangibleBy = {
            category: false,
            asset: false,
            description: false,
            impact: false,
            critical: false,
            likelihood: false,
            vulnerability: false,
            risk: false,
            type: 'desc'
        };
        this.orderTangibleBy = {
            category: false,
            asset: false,
            description: false,
            impact: false,
            critical: false,
            likelihood: false,
            vulnerability: false,
            risk: false,
            type: 'desc'
        };
        this.selfAssessment = this.dataSharingService.selfAssessment;

        if (this.selfAssessment) {
            this.riskService.getMyAssetsAtRisk(this.selfAssessment)
                .toPromise()
                .then((response: MyAssetRisk[]) => {
                    this.handleMyAssetsAtRisk(response);
                })
                .catch(reason => {
                    this.loadingAssetsAndAttacks = false;
                })
        }

        this.subscriptions.push(
            this.dataSharingService.selfAssessmentObservable
                .pipe(
                    switchMap((newAssessment: SelfAssessmentMgm) => {
                        if (newAssessment) {
                            // Check if there is no self assessment or if it has changed
                            if (!this.selfAssessment || this.selfAssessment.id !== newAssessment.id) {
                                this.selfAssessment = newAssessment;

                                return this.riskService.getMyAssetsAtRisk(this.selfAssessment)
                                    .catch((err) => {
                                        return Observable.empty<MyAssetRisk>();
                                    });
                            } else {
                                return Observable.empty<MyAssetRisk>();
                            }
                        } else {
                            return Observable.empty<MyAssetRisk>();
                        }
                    })
                ).subscribe(
                (response: MyAssetRisk[]) => {
                    this.handleMyAssetsAtRisk(response);
                },
                (error) => {
                    this.loadingAssetsAndAttacks = false;
                })
        );
    }

    private resetOrder(witchCategory: string) {
        if (witchCategory === 'TANGIBLE') {
            this.orderTangibleBy.asset = false;
            this.orderTangibleBy.category = false;
            this.orderTangibleBy.critical = false;
            this.orderTangibleBy.description = false;
            this.orderTangibleBy.impact = false;
            this.orderTangibleBy.risk = false;
            this.orderTangibleBy.likelihood = false;
            this.orderTangibleBy.vulnerability = false;
            this.orderTangibleBy.type = 'desc';
        } else {
            this.orderIntangibleBy.asset = false;
            this.orderIntangibleBy.category = false;
            this.orderIntangibleBy.critical = false;
            this.orderIntangibleBy.description = false;
            this.orderIntangibleBy.impact = false;
            this.orderIntangibleBy.risk = false;
            this.orderIntangibleBy.likelihood = false;
            this.orderIntangibleBy.vulnerability = false;
            this.orderIntangibleBy.type = 'desc';
        }
    }

    public tableOrderBy(orderColumn: string, category: string, desc: boolean) {
        if (category === 'TANGIBLE') {
            this.resetOrder('TANGIBLE');
            if (desc) {
                this.orderTangibleBy.type = 'desc';
            } else {
                this.orderTangibleBy.type = 'asc';
            }
            switch (orderColumn.toLowerCase()) {
                case ('category'): {
                    this.orderTangibleBy.category = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.assetcategory.name, ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.assetcategory.name, ['asc']);
                    }
                    break;
                }
                case ('asset'): {
                    this.orderTangibleBy.asset = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.name, ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.name, ['asc']);
                    }
                    break;
                }
                case ('description'): {
                    this.orderTangibleBy.description = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.description, ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.description, ['asc']);
                    }
                    break;
                }
                case ('impact'): {
                    this.orderTangibleBy.impact = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.impact, ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.impact, ['asc']);
                    }
                    break;
                }
                case ('critical'): {
                    this.orderTangibleBy.critical = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, ['critical'], ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, ['critical'], ['asc']);
                    }
                    break;
                }
                case ('likelihood'): {
                    this.orderTangibleBy.likelihood = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, ['likelihood'], ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, ['likelihood'], ['asc']);
                    }
                    break;
                }
                case ('vulnerability'): {
                    this.orderTangibleBy.vulnerability = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, ['vulnerability'], ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, ['vulnerability'], ['asc']);
                    }
                    break;
                }
                case ('risk'): {
                    this.orderTangibleBy.risk = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, ['percentage'], ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, ['percentage'], ['asc']);
                    }
                    break;
                }
            }
        } else {
            this.resetOrder('INTANGIBLE');
            if (desc) {
                this.orderIntangibleBy.type = 'desc';
            } else {
                this.orderIntangibleBy.type = 'asc';
            }
            switch (orderColumn.toLowerCase()) {
                case ('category'): {
                    this.orderIntangibleBy.category = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.assetcategory.name, ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.assetcategory.name, ['asc']);
                    }
                    break;
                }
                case ('asset'): {
                    this.orderIntangibleBy.asset = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.name, ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.name, ['asc']);
                    }
                    break;
                }
                case ('description'): {
                    this.orderIntangibleBy.description = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.description, ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.description, ['asc']);
                    }
                    break;
                }
                case ('impact'): {
                    this.orderIntangibleBy.impact = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.impact, ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.impact, ['asc']);
                    }
                    break;
                }
                case ('critical'): {
                    this.orderIntangibleBy.critical = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['critical'], ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['critical'], ['asc']);
                    }
                    break;
                }
                case ('likelihood'): {
                    this.orderIntangibleBy.likelihood = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['likelihood'], ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['likelihood'], ['asc']);
                    }
                    break;
                }
                case ('vulnerability'): {
                    this.orderIntangibleBy.vulnerability = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['vulnerability'], ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['vulnerability'], ['asc']);
                    }
                    break;
                }
                case ('risk'): {
                    this.orderIntangibleBy.risk = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['percentage'], ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['percentage'], ['asc']);
                    }
                    break;
                }
            }
        }
    }

    private handleMyAssetsAtRisk(response: MyAssetRisk[]) {
        if (response) {
            this.myAssetsAtRisk = response;
            this.myAssetsAtRisk.forEach((myAsset) => {
                this.riskMitigationMap.set(myAsset.id, myAsset.mitigations);
                const risk: RiskPercentageElement = {
                    asset: myAsset,
                    likelihood: myAsset.likelihood,
                    vulnerability: myAsset.vulnerability,
                    critical: myAsset.critical,
                    percentage: myAsset.risk
                };
                if (risk.asset.asset.assetcategory.type.toString() === 'TANGIBLE') {
                    if (this.risksTangible.length === 0) {
                        this.risksTangible.push(_.cloneDeep(risk));
                    } else {
                        const index = _.findIndex(this.risksTangible, (elem) => {
                            return elem.asset.id === myAsset.id;
                        });
                        if (index !== -1) {
                            this.risksTangible.splice(index, 1, _.cloneDeep(risk));
                        } else {
                            this.risksTangible.push(_.cloneDeep(risk));
                        }
                    }
                    this.risksTangible = _.orderBy(this.risksTangible, ['percentage'], ['desc']);
                    this.noRiskInMap = false;
                } else {
                    if (this.risksIntangible.length === 0) {
                        this.risksIntangible.push(_.cloneDeep(risk));
                    } else {
                        const index = _.findIndex(this.risksIntangible, (elem) => {
                            return elem.asset.id === myAsset.id;
                        });
                        if (index !== -1) {
                            this.risksIntangible.splice(index, 1, _.cloneDeep(risk));
                        } else {
                            this.risksIntangible.push(_.cloneDeep(risk));
                        }
                    }
                    this.risksIntangible = _.orderBy(this.risksIntangible, ['percentage'], ['desc']);
                    this.noRiskInMap = false;
                }
            });
            this.loadingAssetsAndAttacks = false;
        } else {
            this.loadingAssetsAndAttacks = false;
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
