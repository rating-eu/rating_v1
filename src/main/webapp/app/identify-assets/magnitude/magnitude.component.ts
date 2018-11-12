import * as _ from 'lodash';

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'magnitude',
    templateUrl: './magnitude.component.html',
    styleUrls: ['./magnitude.component.css'],
})

export class MagnitudeComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
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
