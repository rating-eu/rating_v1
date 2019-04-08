import { DashboardStepEnum } from './../models/enumeration/dashboard-step.enum';
import * as _ from 'lodash';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Principal } from '../../shared';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { IdentifyAssetUtilService } from '../../identify-assets/identify-asset.util.service';
import { MyRole } from '../../entities/enumerations/MyRole.enum';
import { AssetType } from '../../entities/enumerations/AssetType.enum';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService, DashboardStatus, Status } from '../dashboard.service';

interface OrderBy {
    category: boolean;
    assetNumber: boolean;
    type: string;
}

interface TableElement {
    category: string;
    assetNumber: number;
}

@Component({
    selector: 'jhi-asset-widget',
    templateUrl: './asset-widget.component.html',
    styleUrls: ['asset-widget.component.css']
})
export class AssetWidgetComponent implements OnInit, OnDestroy {
    private mySelf: SelfAssessmentMgm = {};
    private closeResult: string;

    public orderIntangibleBy: OrderBy;
    public orderTangibleBy: OrderBy;
    public myAssets: MyAssetMgm[];
    public loading = false;
    public selectedCategory: string;
    public selectedAssetsByCategory: MyAssetMgm[];
    public intangible: MyAssetMgm[];
    public priorities = ['Low', 'Low medium', 'Medium', 'Medium high', 'High'];
    public tangible: MyAssetMgm[];
    public intangibleCategoryMap: Map<string, number[]>;
    public tangibleCategoryMap: Map<string, number[]>;
    public tangibleCategoryKeys: string[];
    public intangibleCategoryKeys: string[];
    public intangibleCategoryMapLoaded = false;
    public tangibleCategoryMapLoaded = false;
    public tableIntangibleInfo: TableElement[] = [];
    public tableTangibleInfo: TableElement[] = [];
    private account: Account;
    private eventSubscriber: Subscription;
    private status: DashboardStatus;
    private dashboardStatus = DashboardStepEnum;

    constructor(
        private principal: Principal,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private idaUtilsService: IdentifyAssetUtilService,
        private eventManager: JhiEventManager,
        private modalService: NgbModal,
        private dashService: DashboardService
    ) {
    }

    ngOnInit() {
        this.loading = true;
        this.status = this.dashService.getStatus();
        this.orderIntangibleBy = {
            category: false,
            assetNumber: false,
            type: 'desc'
        };
        this.orderTangibleBy = {
            category: false,
            assetNumber: false,
            type: 'desc'
        };
        this.principal.identity().then((account) => {
            this.account = account;
            this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
            this.registerChangeIdentifyAssets();
            if (this.account['authorities'].includes(MyRole.ROLE_CISO) && this.mySelf) {
                this.idaUtilsService.getMyAssets(this.mySelf)
                    .toPromise()
                    .then((mySavedAssets) => {
                        if (mySavedAssets) {
                            if (mySavedAssets.length === 0) {
                                this.loading = false;
                                return;
                            }
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
                                        const index = _.findIndex(this.tableIntangibleInfo, { category: myAsset.asset.assetcategory.name });
                                        this.tableIntangibleInfo[index].assetNumber++;
                                        assetsTemp.push(myAsset.id);
                                        this.intangibleCategoryMap.set(myAsset.asset.assetcategory.name, assetsTemp);
                                    } else {
                                        this.intangibleCategoryMap.set(myAsset.asset.assetcategory.name, [myAsset.id]);
                                        this.intangibleCategoryKeys.push(myAsset.asset.assetcategory.name);
                                        const elem: TableElement = {
                                            category: myAsset.asset.assetcategory.name,
                                            assetNumber: 1
                                        };
                                        this.tableIntangibleInfo.push(elem);
                                    }
                                } else if (myAsset.asset.assetcategory.type.toString() === AssetType.TANGIBLE.toString()) {
                                    this.tangible.push(myAsset);
                                    if (this.tangibleCategoryMap.has(myAsset.asset.assetcategory.name)) {
                                        const assetsTemp = this.tangibleCategoryMap.get(myAsset.asset.assetcategory.name);
                                        const index = _.findIndex(this.tableTangibleInfo, { category: myAsset.asset.assetcategory.name });
                                        this.tableTangibleInfo[index].assetNumber++;
                                        assetsTemp.push(myAsset.id);
                                        this.tangibleCategoryMap.set(myAsset.asset.assetcategory.name, assetsTemp);
                                    } else {
                                        this.tangibleCategoryMap.set(myAsset.asset.assetcategory.name, [myAsset.id]);
                                        this.tangibleCategoryKeys.push(myAsset.asset.assetcategory.name);
                                        const elem: TableElement = {
                                            category: myAsset.asset.assetcategory.name,
                                            assetNumber: 1
                                        };
                                        this.tableTangibleInfo.push(elem);
                                    }
                                }
                            }
                            this.intangibleCategoryMapLoaded = true;
                            this.tangibleCategoryMapLoaded = true;
                            this.loading = false;
                        } else {
                            this.loading = false;
                        }
                    }).catch(() => {
                        this.loading = false;
                    });

                this.dashService.getStatusFromServer(this.mySelf, this.dashboardStatus.ASSET_CLUSTERING).toPromise().then((res) => {
                    this.status.assetClusteringStatus = Status[res];
                    this.dashService.updateStepStatus(DashboardStepEnum.ASSET_CLUSTERING, this.status.assetClusteringStatus);
                });
            }
        }).catch(() => {
            this.loading = false;
        });
    }

    ngOnDestroy() {
        if (this.eventManager && this.eventSubscriber) {
            this.eventManager.destroy(this.eventSubscriber);
        }
    }

    registerChangeIdentifyAssets() {
        this.eventSubscriber = this.eventManager.subscribe('IdentifyAsssetsModification', (response) => this.ngOnInit());
    }

    open(content) {
        this.modalService.open(content, { size: 'lg' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
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
            this.orderTangibleBy.assetNumber = false;
            this.orderTangibleBy.category = false;
            this.orderTangibleBy.type = 'desc';
        } else {
            this.orderIntangibleBy.assetNumber = false;
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
                        this.tableTangibleInfo = _.orderBy(this.tableTangibleInfo, ['category'], ['desc']);
                    } else {
                        this.tableTangibleInfo = _.orderBy(this.tableTangibleInfo, ['category'], ['asc']);
                    }
                    break;
                }
                case ('asset_number'): {
                    this.orderTangibleBy.assetNumber = true;
                    if (desc) {
                        this.tableTangibleInfo = _.orderBy(this.tableTangibleInfo, ['assetNumber'], ['desc']);
                    } else {
                        this.tableTangibleInfo = _.orderBy(this.tableTangibleInfo, ['assetNumber'], ['asc']);
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
                        this.tableIntangibleInfo = _.orderBy(this.tableIntangibleInfo, ['category'], ['desc']);
                    } else {
                        this.tableIntangibleInfo = _.orderBy(this.tableIntangibleInfo, ['category'], ['asc']);
                    }
                    break;
                }
                case ('asset_number'): {
                    this.orderTangibleBy.assetNumber = true;
                    if (desc) {
                        this.tableIntangibleInfo = _.orderBy(this.tableIntangibleInfo, ['assetNumber'], ['desc']);
                    } else {
                        this.tableIntangibleInfo = _.orderBy(this.tableIntangibleInfo, ['assetNumber'], ['asc']);
                    }
                    break;
                }
            }
        }
    }
}
