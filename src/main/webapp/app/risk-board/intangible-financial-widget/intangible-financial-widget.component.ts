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

import {ImpactEvaluationStatus} from "../../impact-evaluation/quantitative/model/impact-evaluation-status.model";
import {ImpactEvaluationService} from './../../impact-evaluation/impact-evaluation.service';
import * as _ from 'lodash';
import {MyAssetMgm} from './../../entities/my-asset-mgm/my-asset-mgm.model';
import {SelfAssessmentMgm} from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import {SelfAssessmentMgmService} from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import {IdentifyAssetUtilService} from './../../identify-assets/identify-asset.util.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AssetType} from '../../entities/enumerations/AssetType.enum';
import {CategoryType} from '../../entities/enumerations/CategoryType.enum';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {SectorType} from "../../entities/enumerations/SectorTyep.enum";
import {switchMap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import {of} from "rxjs/observable/of";

interface OrderBy {
    category: boolean;
    value: boolean;
    type: string;
}

@Component({
    selector: 'jhi-intangible-financial-widget',
    templateUrl: './intangible-financial-widget.component.html',
    styleUrls: ['intangible-financial-widget.component.css']
})
export class IntangibleFinancialWidgetComponent implements OnInit, OnDestroy {
    private selfAssessment: SelfAssessmentMgm = null;
    private wp3Status: ImpactEvaluationStatus;

    public intangible: MyAssetMgm[];
    public loading = false;
    public isCollapsed = true;
    public companySector: string;
    public tableInfo: {
        splitting: string,
        value: number,
        type: string
    }[];
    public orderBy: OrderBy;
    public selectedCategory: string;
    public assetsBySelectedCategory: MyAssetMgm[] = [];
    public priorities = ['Low', 'Low medium', 'Medium', 'Medium high', 'High'];
    private subscriptions: Subscription[];

    constructor(
        private selfAssessmentService: SelfAssessmentMgmService,
        private idaUtilsService: IdentifyAssetUtilService,
        private impactService: ImpactEvaluationService,
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.selfAssessment = this.dataSharingService.selfAssessment;
        this.loading = true;
        this.orderBy = {
            category: false,
            value: false,
            type: 'desc'
        };

        if (this.selfAssessment) {
            this.idaUtilsService.getMyAssets(this.selfAssessment)
                .toPromise()
                .then((mySavedAssets: MyAssetMgm[]) => {
                    this.handleMyAssets(mySavedAssets);
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

                                return this.idaUtilsService.getMyAssets(this.selfAssessment);
                            } else {
                                return of([]);
                            }
                        } else {
                            return of([]);
                        }
                    }
                )).subscribe((response: MyAssetMgm[]) => {
                    this.handleMyAssets(response);
                },
                (error) => {
                    this.loading = false;
                }
            )
        );
    }

    public setAssetCategory(category: string) {
        if (this.selectedCategory === category) {
            this.selectedCategory = undefined;
        } else {
            this.selectedCategory = category;
        }
        this.assetsBySelectedCategory = [];
        switch (category) {
            case 'ORG_CAPITAL': {
                for (const asset of this.intangible) {
                    if (asset.asset.assetcategory.name === 'Organisational capital' ||
                        asset.asset.assetcategory.name === 'Reputation' ||
                        asset.asset.assetcategory.name === 'Brand') {
                        this.assetsBySelectedCategory.push(asset);
                    }
                }
                break;
            }
            case 'KEY_COMP': {
                for (const asset of this.intangible) {
                    if (asset.asset.assetcategory.name === 'Key competences and human capital') {
                        this.assetsBySelectedCategory.push(asset);
                    }
                }
                break;
            }
            case 'IP': {
                for (const asset of this.intangible) {
                    if (asset.asset.assetcategory.name === 'Intellectual Property (IPR)' ||
                        asset.asset.assetcategory.name === 'Innovation') {
                        this.assetsBySelectedCategory.push(asset);
                    }
                }
                break;
            }
        }
    }

    private resetOrder() {
        this.orderBy.category = false;
        this.orderBy.value = false;
        this.orderBy.type = 'desc';
    }

    private handleMyAssets(mySavedAssets: MyAssetMgm[]) {
        if (mySavedAssets && mySavedAssets.length) {
            this.intangible = [];
            for (const myAsset of mySavedAssets) {
                if (myAsset.asset.assetcategory.type === AssetType.INTANGIBLE) {
                    this.intangible.push(myAsset);
                }
            }
            this.intangible = _.orderBy(this.intangible, ['economicValue'], ['desc']);
            this.impactService.getStatus(this.selfAssessment).toPromise().then((status) => {
                if (status) {
                    this.wp3Status = status;
                    this.tableInfo = [];
                    for (const impact of this.wp3Status.splittingValues) {
                        if (!this.companySector && impact.sectorType !== SectorType.GLOBAL) {
                            this.companySector = SectorType[impact.sectorType].charAt(0).toUpperCase() + SectorType[impact.sectorType].slice(1).toLowerCase();
                        } else {
                            this.companySector = 'Global';
                        }
                        switch (impact.categoryType) {
                            case CategoryType.IP: {
                                this.tableInfo.push({
                                    splitting: 'Intellectual Properties',
                                    value: Math.round(impact.value * 100) / 100,
                                    type: 'IP'
                                });
                                break;
                            }
                            case CategoryType.KEY_COMP: {
                                this.tableInfo.push({
                                    splitting: 'Key Competences',
                                    value: Math.round(impact.value * 100) / 100,
                                    type: 'KEY_COMP'
                                });
                                break;
                            }
                            case CategoryType.ORG_CAPITAL: {
                                this.tableInfo.push({
                                    splitting: 'Organizational Capital (Reputation & Brand included )',
                                    value: Math.round(impact.value * 100) / 100,
                                    type: 'ORG_CAPITAL'
                                });
                                break;
                            }
                        }
                    }
                    this.tableInfo = _.orderBy(this.tableInfo, ['value'], ['desc']);
                    this.loading = false;
                } else {
                    this.loading = false;
                }
            }).catch(() => {
                this.loading = false;
            });
            this.loading = false;
        } else {
            this.loading = false;
        }
    }

    public tableOrderBy(orderColumn: string, desc: boolean) {
        this.resetOrder();
        if (desc) {
            this.orderBy.type = 'desc';
        } else {
            this.orderBy.type = 'asc';
        }
        switch (orderColumn.toLowerCase()) {
            case ('category'): {
                this.orderBy.category = true;
                if (desc) {
                    this.tableInfo = _.orderBy(this.tableInfo, ['splitting'], ['desc']);
                } else {
                    this.tableInfo = _.orderBy(this.tableInfo, ['splitting'], ['asc']);
                }
                break;
            }
            case ('value'): {
                this.orderBy.value = true;
                if (desc) {
                    this.tableInfo = _.orderBy(this.tableInfo, ['value'], ['desc']);
                } else {
                    this.tableInfo = _.orderBy(this.tableInfo, ['value'], ['asc']);
                }
                break;
            }
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
