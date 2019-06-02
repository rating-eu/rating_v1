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

import {AssetMgm} from './../../entities/asset-mgm/asset-mgm.model';
import {MyAssetMgm} from './../../entities/my-asset-mgm/my-asset-mgm.model';
import * as _ from 'lodash';

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImpactEvaluationService} from '../../impact-evaluation/impact-evaluation.service';
import {CategoryType} from '../../entities/enumerations/CategoryType.enum';
import {SelfAssessmentMgmService, SelfAssessmentMgm} from '../../entities/self-assessment-mgm';
import {ImpactEvaluationStatus} from "../../impact-evaluation/quantitative/model/impact-evaluation-status.model";
import {DatasharingService} from "../../datasharing/datasharing.service";
import {SectorType} from "../../entities/enumerations/SectorTyep.enum";
import {Observable, Subscription} from "rxjs";
import {forkJoin} from "rxjs/observable/forkJoin";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs/observable/of";

interface OrderBy {
    category: boolean;
    value: boolean;
    type: string;
}

@Component({
    selector: 'jhi-losses-widget',
    templateUrl: './losses-widget.component.html',
    styleUrls: ['losses-widget.component.css']
})
export class LossesWidgetComponent implements OnInit, OnDestroy {
    public loading = false;
    public isCollapsed = true;
    public companySector: string;
    public lossesPercentage: number;
    public tableInfo: {
        splitting: string,
        value: number,
        type: string
    }[];
    public orderBy: OrderBy;
    public selectedCategory: string;
    public assetsBySelectedCategory: MyAssetMgm[] = [];

    private myAssets: MyAssetMgm[] = [];
    private wp3Status: ImpactEvaluationStatus;
    private selfAssessment: SelfAssessmentMgm;

    private subscriptions: Subscription[];

    constructor(
        private impactService: ImpactEvaluationService,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.loading = true;
        this.selfAssessment = this.dataSharingService.selfAssessment;
        this.orderBy = {
            category: false,
            value: false,
            type: 'desc'
        };

        if (this.selfAssessment) {
            this.fetchMyAssetsAndImpactStatus()
                .toPromise()
                .then((response: [MyAssetMgm[], ImpactEvaluationStatus]) => {
                    if (response && response.length && response.length === 2) {
                        this.handleMyAssetsAndStatus(response[0], response[1]);
                    }
                }, (error) => {
                    this.loading = false;
                })
        }

        this.subscriptions.push(
            this.dataSharingService.selfAssessmentObservable.pipe(
                switchMap((newAssessment: SelfAssessmentMgm) => {
                    if (newAssessment) {
                        // Check if there is no self assessment or if it has changed
                        if (!this.selfAssessment || this.selfAssessment.id !== newAssessment.id) {
                            this.selfAssessment = newAssessment;

                            return this.fetchMyAssetsAndImpactStatus();
                        } else {
                            return forkJoin(of([]), of(null));
                        }
                    } else {
                        return forkJoin(of([]), of(null));
                    }
                })
            ).subscribe((response: [MyAssetMgm[], ImpactEvaluationStatus]) => {
                    if (response && response.length && response.length === 2) {
                        this.handleMyAssetsAndStatus(response[0], response[1]);
                    }
                },
                (error) => {
                    this.loading = false;
                })
        );
    }

    private fetchMyAssetsAndImpactStatus(): Observable<[MyAssetMgm[], ImpactEvaluationStatus]> {
        return forkJoin(
            this.impactService.getMyAssets(this.selfAssessment)
                .catch((err) => {
                    return of([]);
                }),
            this.impactService.getStatus(this.selfAssessment)
                .catch((err) => {
                    return of(null);
                })
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
                for (const asset of this.myAssets) {
                    if (asset.asset.assetcategory.name === 'Organisational capital' ||
                        asset.asset.assetcategory.name === 'Reputation' ||
                        asset.asset.assetcategory.name === 'Brand') {
                        this.assetsBySelectedCategory.push(asset);
                    }
                }
                break;
            }
            case 'KEY_COMP': {
                for (const asset of this.myAssets) {
                    if (asset.asset.assetcategory.name === 'Key competences and human capital') {
                        this.assetsBySelectedCategory.push(asset);
                    }
                }
                break;
            }
            case 'IP': {
                for (const asset of this.myAssets) {
                    if (asset.asset.assetcategory.name === 'Intellectual Property (IPR)' ||
                        asset.asset.assetcategory.name === 'Innovation') {
                        this.assetsBySelectedCategory.push(asset);
                    }
                }
                break;
            }
            case 'DATA': {
                for (const asset of this.myAssets) {
                    if (asset.asset.assetcategory.name === 'Data') {
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

    private handleMyAssetsAndStatus(myAssets: MyAssetMgm[], status: ImpactEvaluationStatus) {
        if (myAssets) {
            this.myAssets = myAssets;
        }

        if (status) {
            this.wp3Status = status;
            this.tableInfo = [];
            this.lossesPercentage = this.wp3Status.economicCoefficients.lossOfIntangible ? this.wp3Status.economicCoefficients.lossOfIntangible / 100 : undefined;
            for (const impact of this.wp3Status.splittingLosses) {
                if (!this.companySector && impact.sectorType !== SectorType.GLOBAL) {
                    this.companySector = SectorType[impact.sectorType].charAt(0).toUpperCase() + SectorType[impact.sectorType].slice(1).toLowerCase();
                } else {
                    this.companySector = 'Global';
                }
                switch (impact.categoryType) {
                    case CategoryType.IP: {
                        this.tableInfo.push({
                            splitting: 'Intellectual Properties',
                            value: Math.round(impact.loss * 100) / 100,
                            type: 'IP'
                        });
                        break;
                    }
                    case CategoryType.KEY_COMP: {
                        this.tableInfo.push({
                            splitting: 'Key Competences',
                            value: Math.round(impact.loss * 100) / 100,
                            type: 'KEY_COMP'
                        });
                        break;
                    }
                    case CategoryType.ORG_CAPITAL: {
                        this.tableInfo.push({
                            splitting: 'Organizational Capital (Reputation & Brand included )',
                            value: Math.round(impact.loss * 100) / 100,
                            type: 'ORG_CAPITAL'
                        });
                        break;
                    }
                    case CategoryType.DATA: {
                        this.tableInfo.push({
                            splitting: 'Data',
                            value: Math.round(impact.loss * 100) / 100,
                            type: 'DATA'
                        });
                        break;
                    }
                }
                this.tableInfo = _.orderBy(this.tableInfo, ['value'], ['desc']);
                this.loading = false;
            }
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
