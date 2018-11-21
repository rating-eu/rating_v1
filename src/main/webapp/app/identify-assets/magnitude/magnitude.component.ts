import { Priority } from './../model/enumeration/priority.enum';
import { AssetType } from './../../entities/enumerations/AssetType.enum';
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { IdentifyAssetUtilService } from './../identify-asset.util.service';
import * as _ from 'lodash';

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'magnitude',
    templateUrl: './magnitude.component.html',
    styleUrls: ['./magnitude.component.css'],
})

export class MagnitudeComponent implements OnInit, OnDestroy {
    private mySelf: SelfAssessmentMgm = {};
    public myAssets: MyAssetMgm[];
    public selectedAsset: MyAssetMgm;
    public isMyAssetUpdated = false;
    public isIntangible = false;
    public priorities = ['Not Available', 'Low', 'Low medium', 'Medium', 'Medium high', 'High'];

    constructor(
        private idaUtilsService: IdentifyAssetUtilService,
        private mySelfAssessmentService: SelfAssessmentMgmService
    ) {

    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.idaUtilsService.getMySavedAssets(this.mySelf).toPromise().then((mySavedAssets) => {
            if (mySavedAssets) {
                this.myAssets = mySavedAssets;
            }
        }).catch(() => {
        });
    }

    public selectAsset(myAsset: MyAssetMgm) {
        this.isIntangible = false;
        if (myAsset) {
            if (this.selectedAsset) {
                if (this.selectedAsset.id === myAsset.id) {
                    this.selectedAsset = null;
                } else {
                    this.selectedAsset = myAsset;
                    if (this.selectedAsset.asset.assetcategory.type.toString() === AssetType.INTANGIBLE.toString()) {
                        this.isIntangible = true;
                    }
                }
            } else {
                this.selectedAsset = myAsset;
                if (this.selectedAsset.asset.assetcategory.type.toString() === AssetType.INTANGIBLE.toString()) {
                    this.isIntangible = true;
                }
            }
        }
    }

    public updateMyAsset() {
        // constraint su pryority level
        if (!this.selectedAsset.estimated) {
            this.selectedAsset.magnitude = undefined;
        }
        this.idaUtilsService.updateAsset(this.selectedAsset).toPromise().then((updatedAssets) => {
            this.selectedAsset = updatedAssets;
            const index = _.findIndex(this.myAssets, { id: this.selectedAsset.id });
            this.myAssets.splice(index, 1, this.selectedAsset);
            this.isMyAssetUpdated = false;
        });
    }

    public setSelectedAssetPriority(priority: String) {
        if (priority) {
            switch (priority) {
                case Priority.NOT_AVAILABLE.toString().replace('_', ' ').substring(0, 1) +
                    Priority.NOT_AVAILABLE.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.ranking = 0;
                        break;
                    }
                case Priority.LOW.toString().replace('_', ' ').substring(0, 1) +
                    Priority.LOW.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.ranking = 1;
                        break;
                    }
                case Priority.LOW_MEDIUM.toString().replace('_', ' ').substring(0, 1) +
                    Priority.LOW_MEDIUM.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.ranking = 2;
                        break;
                    }
                case Priority.MEDIUM.toString().replace('_', ' ').substring(0, 1) +
                    Priority.MEDIUM.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.ranking = 3;
                        break;
                    }
                case Priority.MEDIUM_HIGH.toString().replace('_', ' ').substring(0, 1) +
                    Priority.MEDIUM_HIGH.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.ranking = 4;
                        break;
                    }
                case Priority.HIGH.toString().replace('_', ' ').substring(0, 1) +
                    Priority.HIGH.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.ranking = 5;
                        break;
                    }
                default: {
                    this.selectedAsset.ranking = 0;
                    break;
                }
            }
            this.isMyAssetUpdated = true;
        }
    }

    public setSelectedAssetMagnitudo(priority: String) {
        if (priority) {
            switch (priority) {
                case Priority.NOT_AVAILABLE.toString().replace('_', ' ').substring(0, 1) +
                    Priority.NOT_AVAILABLE.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.magnitude = '0';
                        break;
                    }
                case Priority.LOW.toString().replace('_', ' ').substring(0, 1) +
                    Priority.LOW.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.magnitude = '1';
                        break;
                    }
                case Priority.LOW_MEDIUM.toString().replace('_', ' ').substring(0, 1) +
                    Priority.LOW_MEDIUM.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.magnitude = '2';
                        break;
                    }
                case Priority.MEDIUM.toString().replace('_', ' ').substring(0, 1) +
                    Priority.MEDIUM.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.magnitude = '3';
                        break;
                    }
                case Priority.MEDIUM_HIGH.toString().replace('_', ' ').substring(0, 1) +
                    Priority.MEDIUM_HIGH.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.magnitude = '4';
                        break;
                    }
                case Priority.HIGH.toString().replace('_', ' ').substring(0, 1) +
                    Priority.HIGH.toString().replace('_', ' ').substring(1).toLowerCase(): {
                        this.selectedAsset.magnitude = '5';
                        break;
                    }
                default: {
                    this.selectedAsset.magnitude = '0';
                    break;
                }
            }
            this.isMyAssetUpdated = true;
        }
    }
}
