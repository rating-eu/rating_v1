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
    public selectedAsset: MyAssetMgm;
    public isDirect = false;
    public isMyAssetUpdated = false;
    private myDirects: DirectAssetMgm[];
    private myIndirects: IndirectAssetMgm[];
    private selectedDirectAsset: DirectAssetMgm;
    private selectedIndirectAssets: IndirectAssetMgm[];

    constructor(
        private idaUtilsService: IdentifyAssetUtilService,
        private mySelfAssessmentService: SelfAssessmentMgmService
    ) {

    }

    ngOnInit(): void {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        // TODO pensare ad una funzionalità per recuperare gli asset a partire dal questionario
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
        // TODO Questa richiesta potrebbe essere superflua a reggime gli indirect dovrebbero essere nei direct -> effects
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
                }
            } else {
                this.selectedAsset = myAsset;
            }
            if (this.selectedAsset) {
                const index = _.findIndex(this.myDirects, (myDirect) => myDirect.myAsset.id === myAsset.id);
                if (index !== -1) {
                    this.isDirect = true;
                    this.selectedDirectAsset = _.cloneDeep(this.myDirects[index]);
                } else {
                    this.isDirect = false;
                }
                this.selectedIndirectAssets = [];
                if (this.selectedDirectAsset.effects) {
                    this.selectedIndirectAssets = this.selectedDirectAsset.effects;
                }
                // TODO Questo ciclo FOR potrebbe essere superfluo a reggime
                for (const indirect of this.myIndirects) {
                    if (indirect.directAsset.id === this.selectedDirectAsset.id) {
                        const indIndex = _.findIndex(this.selectedIndirectAssets, (myIndirect) => myIndirect.directAsset.id === indirect.directAsset.id);
                        if (indIndex === -1) {
                            this.selectedIndirectAssets.push(_.cloneDeep(indirect));
                        }
                    }
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
        this.isMyAssetUpdated = true;
        console.log(this.selectedDirectAsset);
    }

    public setIndirectAsset(myAsset: MyAssetMgm) {
        let indirects: IndirectAssetMgm[] = [];
        if (this.selectedDirectAsset.effects) {
            indirects = this.selectedDirectAsset.effects;
        }
        // TODO Questo ciclo FOR potrebbe essere superfluo a reggime
        for (const indirect of this.myIndirects) {
            if (indirect.directAsset.id === this.selectedDirectAsset.id) {
                const indIndex = _.findIndex(indirects, (myIndirect) => myIndirect.directAsset.id === indirect.directAsset.id);
                if (indIndex === -1) {
                    indirects.push(_.cloneDeep(indirect));
                }
            }
        }
        // const index = _.findIndex(this.myIndirects, (myIndirect) => myIndirect.myAsset.id === myAsset.id);
        const index = _.findIndex(indirects, (myIndirect) => myIndirect.myAsset.id === myAsset.id);
        this.isMyAssetUpdated = true;
        if (index !== -1) {
            const myIndex = _.findIndex(this.selectedIndirectAssets, { id: this.myIndirects[index].id });
            if (myIndex !== -1) {
                this.selectedIndirectAssets.splice(myIndex, 1);
            } else {
                this.selectedIndirectAssets.push(_.cloneDeep(this.myIndirects[index]));
            }
        } else {
            const myIndex = _.findIndex(this.selectedIndirectAssets, (indirect) => indirect.myAsset.id === myAsset.id);
            if (myIndex !== -1) {
                this.selectedIndirectAssets.splice(myIndex, 1);
            } else {
                const indirect = new IndirectAssetMgm();
                indirect.costs = undefined;
                indirect.directAsset = undefined;
                indirect.myAsset = myAsset;
                this.selectedIndirectAssets.push(_.cloneDeep(indirect));
            }
        }
        console.log(this.selectedIndirectAssets);
    }

    public isIndirect(myAsset: MyAssetMgm): boolean {
        if (this.selectedIndirectAssets) {
            const index = _.findIndex(this.selectedIndirectAssets, (myIndirect) => myIndirect.myAsset.id === myAsset.id);
            if (index !== -1) {
                return true;
            }
        }
        return false;
    }

    public updateMyAsset() {
        console.log(this.selectedAsset);
        console.log(this.selectedDirectAsset);
        // this.idaUtilsService.updateAsset(this.selectedAsset);
        if (this.selectedIndirectAssets) {
            this.selectedDirectAsset.effects = this.selectedIndirectAssets;
        }
        this.idaUtilsService.updateDirectAsset(this.selectedDirectAsset).toPromise().then((myDirectAsset) => {
            if (myDirectAsset) {
                this.selectedDirectAsset = myDirectAsset;
                const index = _.findIndex(this.myDirects, { id: this.selectedDirectAsset.id });
                if (index !== -1) {
                    this.myDirects.splice(index, 1, this.selectedDirectAsset);
                } else {
                    this.myDirects.push(_.cloneDeep(this.selectedDirectAsset));
                }
                this.isMyAssetUpdated = false;
            }
        });
    }
}
