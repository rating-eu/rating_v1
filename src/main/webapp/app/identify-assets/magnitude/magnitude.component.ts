import { Router } from '@angular/router';
import { Priority } from './../model/enumeration/priority.enum';
import { AssetType } from './../../entities/enumerations/AssetType.enum';
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { IdentifyAssetUtilService } from './../identify-asset.util.service';
import { JhiAlertService } from '../../../../../../node_modules/ng-jhipster';
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
    public loading = false;
    public isFull = false;
    public isDescriptionCollapsed = true;
    public priorities = ['Not available', 'Low', 'Low medium', 'Medium', 'Medium high', 'High'];

    constructor(
        private idaUtilsService: IdentifyAssetUtilService,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private router: Router,
        private jhiAlertService: JhiAlertService,
    ) {

    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.idaUtilsService.getMySavedAssets(this.mySelf).toPromise().then((mySavedAssets) => {
            if (mySavedAssets) {
                this.myAssets = mySavedAssets;
                this.priorityCheck();
            }
        }).catch(() => {
        });
    }

    private priorityCheck() {
        let pryorityCounter = 0;
        for (const asset of this.myAssets) {
            if (asset.ranking >= 0) {
                pryorityCounter++;
            }
        }
        if (pryorityCounter === this.myAssets.length) {
            this.isFull = true;
        }
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

    public updateMyAsset(onNext: boolean) {
        if (!this.selectedAsset) {
            if (onNext) {
                this.router.navigate(['/identify-asset/cascade-effects']);
            } else {
                return;
            }
        }
        this.loading = true;
        if (!this.selectedAsset.estimated) {
            this.selectedAsset.magnitude = undefined;
        }
        if (this.isMyAssetUpdated) {
            this.idaUtilsService.updateAsset(this.selectedAsset).toPromise().then((updatedAssets) => {
                // this.selectedAsset = updatedAssets;
                const index = _.findIndex(this.myAssets, { id: updatedAssets.id });
                this.myAssets.splice(index, 1, _.cloneDeep(updatedAssets));
                this.isMyAssetUpdated = false;
                this.loading = false;
                this.jhiAlertService.success('hermeneutApp.messages.saved', null, null);
                if (onNext) {
                    this.router.navigate(['/identify-asset/cascade-effects']);
                }
            }).catch(() => {
                this.loading = false;
                this.jhiAlertService.error('hermeneutApp.messages.error', null, null);
            });
        } else {
            this.loading = false;
            if (onNext) {
                this.router.navigate(['/identify-asset/cascade-effects']);
            }
        }
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
            this.priorityCheck();
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
