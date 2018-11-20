import { IndirectAssetMgm } from './../../entities/indirect-asset-mgm/indirect-asset-mgm.model';
import { DirectAssetMgm } from './../../entities/direct-asset-mgm/direct-asset-mgm.model';
import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import { IdentifyAssetUtilService } from './../identify-asset.util.service';
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cascade-effects',
    templateUrl: './cascade-effects.component.html',
    styleUrls: ['./cascade-effects.component.css'],
})

export class CascadeEffectsComponent implements OnInit {
    private mySelf: SelfAssessmentMgm = {};
    public myAssets: MyAssetMgm[];
    public myDirects: DirectAssetMgm[];
    public myIndirects: IndirectAssetMgm[];
    public selectedDirectAsset: DirectAssetMgm;
    public selectedAsset: MyAssetMgm;
    public isDirect = false;
    public isMyAssetUpdated = false;

    constructor(
        private idaUtilsService: IdentifyAssetUtilService,
        private mySelfAssessmentService: SelfAssessmentMgmService
    ) {

    }

    ngOnInit(): void {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.idaUtilsService.getMySavedAssets(this.mySelf).toPromise().then((mySavedAssets) => {
            if (mySavedAssets) {
                this.myAssets = mySavedAssets;
            }
        });
        this.idaUtilsService.getMySavedDirectAssets(this.mySelf).toPromise().then((mySavedDirect) => {
            if (mySavedDirect) {
                this.myDirects = mySavedDirect;
            }
        });
        this.idaUtilsService.getMySavedIndirectAssets(this.mySelf).toPromise().then((mySavedIndirect) => {
            if (mySavedIndirect) {
                this.myIndirects = mySavedIndirect;
            }
        });
    }

    public selectAsset(myAsset: MyAssetMgm) {
        if (myAsset) {
            if (this.selectedAsset) {
                if (this.selectedAsset.id === myAsset.id) {
                    this.selectedAsset = null;
                } else {
                    this.selectedAsset = myAsset;
                    const index = _.findIndex(this.myDirects, (myDirect) => myDirect.myAsset.id === myAsset.id);
                    if (index !== -1) {
                        this.isDirect = true;
                        this.selectedDirectAsset = this.myDirects[index];
                    } else {
                        this.isDirect = false;
                    }
                }
            } else {
                this.selectedAsset = myAsset;
                const index = _.findIndex(this.myDirects, (myDirect) => myDirect.myAsset.id === myAsset.id);
                if (index !== -1) {
                    this.isDirect = true;
                    this.selectedDirectAsset = this.myDirects[index];
                } else {
                    this.isDirect = false;
                }
            }
        }
    }

    public setDirectAsset(myAsset: MyAssetMgm, isDirect: boolean) {
        if (isDirect) {
            this.isDirect = true;
            const index = _.findIndex(this.myDirects, (myDirect) => myDirect.myAsset.id === myAsset.id);
            if (index !== -1) {
                this.selectedDirectAsset = _.cloneDeep(this.myDirects[index]);
            }
            if (!this.selectedDirectAsset) {
                this.selectedDirectAsset = new DirectAssetMgm();
                this.selectedDirectAsset.costs = undefined;
                this.selectedDirectAsset.effects = undefined;
                this.selectedDirectAsset.myAsset = myAsset;
            }
        } else {
            this.isDirect = false;
            if (this.selectedDirectAsset) {
                this.selectedDirectAsset.costs = undefined;
                this.selectedDirectAsset.effects = undefined;
                this.selectedDirectAsset.myAsset = undefined;
            }
        }
        console.log(this.selectedDirectAsset);
    }

    public updateMyAsset() {
        console.log(this.selectedAsset);
        console.log(this.selectedDirectAsset);
        // this.idaUtilsService.updateAsset(this.selectedAsset);
        this.idaUtilsService.updateDirectAsset(this.selectedDirectAsset).toPromise().then((myDirectAsset) => {
            if (myDirectAsset) {
                this.selectedDirectAsset = myDirectAsset;
                const index = _.findIndex(this.myDirects, { id: this.selectedDirectAsset.id });
                if (index !== -1) {
                    this.myDirects.splice(index, 1, this.selectedDirectAsset);
                } else {
                    this.myDirects.push(_.cloneDeep(this.selectedDirectAsset));
                }
            }
        });
    }
}
