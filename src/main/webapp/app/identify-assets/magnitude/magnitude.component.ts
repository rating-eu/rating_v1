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
            // this.ref.detectChanges();
        }).catch(() => {
            // this.ref.detectChanges();
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
        console.log(this.selectedAsset);
        this.idaUtilsService.updateAsset(this.selectedAsset);
    }

    /*
    public setRank(ans: AnswerMgm, rank: number) {
            const selectedAsset = this.findAsset(ans);
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(this.myQuestionAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    this.myQuestionAssets[indexA].ranking = rank;
                    this.idaUtilsService.updateMyAssets(this.myQuestionAssets[indexA], 'ranking');
                }
            } else {
                for (const sA of selectedAsset) {
                    const indexA = _.findIndex(this.myQuestionAssets,
                        (myAsset) => myAsset.asset.id === sA.id
                    );
                    if (indexA !== -1) {
                        this.myQuestionAssets[indexA].ranking = rank;
                        this.idaUtilsService.updateMyAssets(this.myQuestionAssets[indexA], 'ranking');
                    }
                }
            }
            // console.log(this.idaUtilsService.getMyAssets());
        }

        public whichRank(ans: AnswerMgm, rank: number): boolean {
            const selectedAsset = this.findAsset(ans);
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(this.myQuestionAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    if (this.myQuestionAssets[indexA].ranking === rank) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                const indexA = _.findIndex(this.myQuestionAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset[0].id
                );
                if (indexA !== -1) {
                    if (this.myQuestionAssets[indexA].ranking === rank) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    */
}
