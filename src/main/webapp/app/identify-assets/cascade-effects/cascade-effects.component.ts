import {JhiAlertService} from 'ng-jhipster';
import {Router} from '@angular/router';
import {IndirectAssetMgm} from './../../entities/indirect-asset-mgm/indirect-asset-mgm.model';
import {DirectAssetMgm} from './../../entities/direct-asset-mgm/direct-asset-mgm.model';
import {SelfAssessmentMgmService} from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import {IdentifyAssetUtilService} from './../identify-asset.util.service';
import {MyAssetMgm} from './../../entities/my-asset-mgm/my-asset-mgm.model';
import {SelfAssessmentMgm} from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import * as _ from 'lodash';

import {Component, OnInit} from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cascade-effects',
    templateUrl: './cascade-effects.component.html',
    styleUrls: ['./cascade-effects.component.css'],
})

export class CascadeEffectsComponent implements OnInit {
    private mySelf: SelfAssessmentMgm = {};
    public myAssets: MyAssetMgm[];
    public selectedMyAsset: MyAssetMgm;
    public myAssetStatus: Map<number, string> = new Map<number, string>();
    public isDirect = false;
    public isMyAssetUpdated = false;
    public idMyAsset: number;
    public loading = false;
    public isDescriptionCollapsed = true;
    public selectedDirectAsset: DirectAssetMgm;
    private myDirects: DirectAssetMgm[];
    private selectedIndirectAssets: IndirectAssetMgm[];

    constructor(
        private idaUtilsService: IdentifyAssetUtilService,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private router: Router,
        private jhiAlertService: JhiAlertService,
    ) {

    }

    ngOnInit(): void {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.idaUtilsService.getMyAssets(this.mySelf).toPromise().then((myAssets: MyAssetMgm[]) => {
            if (myAssets) {
                this.myAssets = myAssets;
                this.myAssets = _.orderBy(this.myAssets, ['asset.name'], ['asc']);
                this.myAssets.forEach((myAsset) => {
                    this.myAssetStatus.set(myAsset.id, 'NOT COMPLETED');
                });
                this.idaUtilsService.getMySavedDirectAssets(this.mySelf).toPromise().then((mySavedDirect) => {
                    if (mySavedDirect) {
                        this.myDirects = mySavedDirect;
                        this.myDirects = _.orderBy(this.myDirects, ['myAsset.asset.name'], ['asc']);
                        this.myDirects.forEach((myDirect) => {
                            this.myAssetStatus.set(myDirect.myAsset.id, 'COMPLETED');
                        });
                    }
                });
            }
        });
    }

    public selectAsset(myAsset: MyAssetMgm) {
        if (myAsset) {
            if (this.selectedMyAsset) {
                if (this.selectedMyAsset.id === myAsset.id) {
                    this.selectedMyAsset = null;
                } else {
                    this.selectedMyAsset = myAsset;
                }
            } else {
                this.selectedMyAsset = myAsset;
            }
            if (this.selectedMyAsset) {
                const index = _.findIndex(this.myDirects, (myDirect) => myDirect.myAsset.id === myAsset.id);
                if (index !== -1) {
                    this.isDirect = true;
                    this.selectedDirectAsset = _.cloneDeep(this.myDirects[index]);
                } else {
                    this.isDirect = false;
                    this.selectedDirectAsset = null;
                }
                this.selectedIndirectAssets = [];
                if (this.selectedDirectAsset && this.selectedDirectAsset.effects) {
                    this.selectedIndirectAssets = this.selectedDirectAsset.effects;
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
            if (!this.selectedDirectAsset || !this.selectedDirectAsset.myAsset) {
                this.selectedDirectAsset = new DirectAssetMgm();
                this.selectedDirectAsset.effects = undefined;
                this.selectedDirectAsset.myAsset = myAsset;
                // TODO check this
                // this.selectedDirectAsset.costs = undefined;
                this.selectedDirectAsset.myAsset.costs = undefined;
            }
            this.idMyAsset = this.selectedDirectAsset.myAsset.id;
        } else {
            this.isDirect = false;
            if (this.selectedDirectAsset) {
                this.idMyAsset = this.selectedDirectAsset.myAsset.id;
                // TODO check this
                // this.selectedDirectAsset.costs = undefined;
                this.selectedDirectAsset.effects = undefined;
                this.selectedDirectAsset.myAsset = undefined;
            }
        }
        this.isMyAssetUpdated = true;
    }

    public setIndirectAsset(myAsset: MyAssetMgm) {
        let indirects: IndirectAssetMgm[] = [];
        if (this.selectedDirectAsset.effects) {
            indirects = this.selectedDirectAsset.effects;
        }
        const index = _.findIndex(indirects, (myIndirect) => myIndirect.myAsset.id === myAsset.id);
        this.isMyAssetUpdated = true;
        if (index !== -1) {
            const myIndex = _.findIndex(this.selectedIndirectAssets, {id: indirects[index].id});
            if (myIndex !== -1) {
                this.selectedIndirectAssets.splice(myIndex, 1);
            } else {
                this.selectedIndirectAssets.push(_.cloneDeep(indirects[index]));
            }
        } else {
            const myIndex = _.findIndex(this.selectedIndirectAssets, (indirect) => indirect.myAsset.id === myAsset.id);
            if (myIndex !== -1) {
                this.selectedIndirectAssets.splice(myIndex, 1);
            } else {
                const indirect = new IndirectAssetMgm();
                indirect.directAsset = this.selectedDirectAsset;
                indirect.myAsset = myAsset;
                // TODO check this
                // indirect.costs = undefined;
                indirect.myAsset.costs = undefined;
                this.selectedIndirectAssets.push(_.cloneDeep(indirect));
            }
        }
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

    public updateMyAsset(onNext: boolean) {
        if (!this.selectedDirectAsset) {
            if (onNext) {
                this.router.navigate(['/identify-asset/attack-costs']);
                return;
            } else {
                return;
            }
        }
        this.loading = true;
        const idDirect = this.selectedDirectAsset.id;
        if (this.selectedIndirectAssets && this.selectedDirectAsset.myAsset) {
            this.selectedDirectAsset.effects = this.selectedIndirectAssets;
        }
        if (this.isMyAssetUpdated) {
            this.myAssetStatus.set(this.idMyAsset, 'IN EVALUATION');
            /*TODO check this*/
            // if (/*this.selectedDirectAsset.costs === undefined && */this.selectedDirectAsset.effects === undefined && this.selectedDirectAsset.myAsset === undefined) {
            if (this.selectedDirectAsset.myAsset === undefined || (this.selectedDirectAsset.myAsset.costs === undefined && this.selectedDirectAsset.effects === undefined)) {
                this.idaUtilsService.deleteDirectAsset(this.selectedDirectAsset).toPromise();
                const index = _.findIndex(this.myDirects, {id: idDirect});
                this.myDirects.splice(index, 1);
                this.isMyAssetUpdated = false;
                this.loading = false;
                this.myAssetStatus.set(this.idMyAsset, 'NOT COMPLETED');
            } else {
                this.idaUtilsService.updateDirectAsset(this.selectedDirectAsset).toPromise().then((myDirectAsset) => {
                    if (myDirectAsset) {
                        const index = _.findIndex(this.myDirects, {id: myDirectAsset.id});
                        if (index !== -1) {
                            this.myDirects.splice(index, 1, myDirectAsset);
                        } else {
                            this.myDirects.push(_.cloneDeep(myDirectAsset));
                        }
                        this.isMyAssetUpdated = false;
                        this.loading = false;
                        this.myAssetStatus.set(this.idMyAsset, 'COMPLETED');
                        if (onNext) {
                            this.router.navigate(['/identify-asset/attack-costs']);
                        }
                    }
                }).catch(() => {
                    this.loading = false;
                    this.myAssetStatus.set(this.idMyAsset, 'NOT COMPLETED');
                });
            }
        } else {
            this.loading = false;
            if (onNext) {
                this.router.navigate(['/identify-asset/attack-costs']);
            }
        }
    }
}
