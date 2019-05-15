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

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Principal } from '../../shared';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { Role } from '../../entities/enumerations/Role.enum';
import { IdentifyAssetUtilService } from '../identify-asset.util.service';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { AssetType } from '../../entities/enumerations/AssetType.enum';
import {DatasharingService} from "../../datasharing/datasharing.service";

interface OrderBy {
    category: boolean;
    type: string;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'asset-report',
    templateUrl: './asset-report.component.html',
    styleUrls: ['./asset-report.component.css'],
})

export class AssetReportComponent implements OnInit, OnDestroy {
    public mySelf: SelfAssessmentMgm = null;
    private myAssets: MyAssetMgm[];

    public selectedCategory: string;
    public selectedAssetsByCategory: MyAssetMgm[];
    public intangible: MyAssetMgm[];
    public tangible: MyAssetMgm[];
    public intangibleCategoryMap: Map<string, number[]>;
    public tangibleCategoryMap: Map<string, number[]>;
    public tangibleCategoryKeys: string[];
    public intangibleCategoryKeys: string[];
    public orderIntangibleBy: OrderBy;
    public orderTangibleBy: OrderBy;
    public intangibleCategoryMapLoaded = false;
    public tangibleCategoryMapLoaded = false;

    private account: Account;
    private eventSubscriber: Subscription;

    constructor(
        private principal: Principal,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager,
        private ref: ChangeDetectorRef,
        private idaUtilsService: IdentifyAssetUtilService,
        private dataSharingService: DatasharingService
    ) {

    }
    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
    ngOnInit() {
        this.orderIntangibleBy = {
            category: false,
            type: 'desc'
        };
        this.orderTangibleBy = {
            category: false,
            type: 'desc'
        };
        this.principal.identity().then((account) => {
            this.account = account;
            this.mySelf = this.dataSharingService.selfAssessment;
            this.registerChangeIdentifyAssets();
            if (this.account['authorities'].includes(Role.ROLE_CISO) && this.mySelf) {
                this.idaUtilsService.getMyAssets(this.mySelf)
                    .toPromise()
                    .then((mySavedAssets) => {
                        if (mySavedAssets) {
                            this.myAssets = mySavedAssets;
                            this.tangible = [];
                            this.intangible = [];
                            this.intangibleCategoryMap = new Map<string, number[]>();
                            this.tangibleCategoryMap = new Map<string, number[]>();
                            this.tangibleCategoryKeys = [];
                            this.intangibleCategoryKeys = [];
                            for (const myAsset of this.myAssets) {
                                if (myAsset.asset.assetcategory.type.toString() === AssetType.INTANGIBLE.toString()) {
                                    this.intangible.push(myAsset);
                                    if (this.intangibleCategoryMap.has(myAsset.asset.assetcategory.name)) {
                                        const assetsTemp = this.intangibleCategoryMap.get(myAsset.asset.assetcategory.name);
                                        assetsTemp.push(myAsset.id);
                                        this.intangibleCategoryMap.set(myAsset.asset.assetcategory.name, assetsTemp);
                                    } else {
                                        this.intangibleCategoryMap.set(myAsset.asset.assetcategory.name, [myAsset.id]);
                                        this.intangibleCategoryKeys.push(myAsset.asset.assetcategory.name);
                                    }
                                } else if (myAsset.asset.assetcategory.type.toString() === AssetType.TANGIBLE.toString()) {
                                    this.tangible.push(myAsset);
                                    if (this.tangibleCategoryMap.has(myAsset.asset.assetcategory.name)) {
                                        const assetsTemp = this.tangibleCategoryMap.get(myAsset.asset.assetcategory.name);
                                        assetsTemp.push(myAsset.id);
                                        this.tangibleCategoryMap.set(myAsset.asset.assetcategory.name, assetsTemp);
                                    } else {
                                        this.tangibleCategoryMap.set(myAsset.asset.assetcategory.name, [myAsset.id]);
                                        this.tangibleCategoryKeys.push(myAsset.asset.assetcategory.name);
                                    }
                                }
                            }
                            this.intangibleCategoryMapLoaded = true;
                            this.tangibleCategoryMapLoaded = true;
                        }
                    });
            }
        });
    }

    registerChangeIdentifyAssets() {
        this.eventSubscriber = this.eventManager.subscribe('IdentifyAsssetsModification', (response) => this.ngOnInit());
    }

    selectAssetCategory(key: string) {
        let myAssetsIds: number[];
        this.selectedAssetsByCategory = [];
        if (this.selectedCategory === key) {
            this.selectedCategory = null;
            return;
        }
        if (this.intangibleCategoryMap.has(key)) {
            this.selectedCategory = key;
            myAssetsIds = this.intangibleCategoryMap.get(key);
        } else if (this.tangibleCategoryMap.has(key)) {
            this.selectedCategory = key;
            myAssetsIds = this.tangibleCategoryMap.get(key);
        }
        for (const id of myAssetsIds) {
            const index = _.findIndex(this.myAssets, { id: id as number });
            if (index !== -1) {
                this.selectedAssetsByCategory.push(this.myAssets[index]);
            }
        }
    }

    private resetOrder(witchCategory: string) {
        if (witchCategory === 'TANGIBLE') {
            this.orderTangibleBy.category = false;
            this.orderTangibleBy.type = 'desc';
        } else {
            this.orderIntangibleBy.category = false;
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
                        this.tangibleCategoryKeys = _.orderBy(this.tangibleCategoryKeys, [], ['desc']);
                    } else {
                        this.tangibleCategoryKeys = _.orderBy(this.tangibleCategoryKeys, [], ['asc']);
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
                        this.intangibleCategoryKeys = _.orderBy(this.intangibleCategoryKeys, [], ['desc']);
                    } else {
                        this.intangibleCategoryKeys = _.orderBy(this.intangibleCategoryKeys, [], ['asc']);
                    }
                    break;
                }
            }
        }
    }
}
