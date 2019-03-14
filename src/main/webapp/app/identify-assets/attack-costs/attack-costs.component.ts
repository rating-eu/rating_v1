import { JhiAlertService } from 'ng-jhipster';
import { Router } from '@angular/router';
import { IndirectAssetMgm } from './../../entities/indirect-asset-mgm/indirect-asset-mgm.model';
import { AttackCostMgm, CostType } from './../../entities/attack-cost-mgm/attack-cost-mgm.model';
import * as _ from 'lodash';
import { DirectAssetMgm } from './../../entities/direct-asset-mgm/direct-asset-mgm.model';
import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import { IdentifyAssetUtilService } from './../identify-asset.util.service';
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'attack-costs',
    templateUrl: './attack-costs.component.html',
    styleUrls: ['./attack-costs.component.css'],
})
export class AttackCostsComponent implements OnInit {
    private mySelf: SelfAssessmentMgm = {};
    private myCosts: Map<number, AttackCostMgm[]> = new Map<number, AttackCostMgm[]>();
    public myAssets: MyAssetMgm[];
    public myAssetStatus: Map<number, string> = new Map<number, string>();
    public myDirects: DirectAssetMgm[];
    public selectedDirectAsset: DirectAssetMgm;
    public selectedIndirectAsset: IndirectAssetMgm;
    public isMyAssetUpdated = false;
    public isDescriptionCollapsed = true;
    public loading = false;
    public refresh = false;
    public refreshIndirect = false;
    public warningDirect = false;
    public warningIndirect = false;
    public costs: CostType[] = Object.keys(CostType).filter((key) => !isNaN(Number(key))).map((type) => CostType[type]);

    constructor(
        private idaUtilsService: IdentifyAssetUtilService,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private router: Router,
        private jhiAlertService: JhiAlertService,
        private ref: ChangeDetectorRef
    ) {

    }

    ngOnInit(): void {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.idaUtilsService.getMySavedAssets(this.mySelf).toPromise().then((mySavedAssets) => {
            if (mySavedAssets) {
                this.myAssets = mySavedAssets;
                this.myAssets = _.orderBy(this.myAssets, ['asset.name'], ['asc']);
                this.myAssets.forEach((myAsset) => {
                    if (myAsset.costs !== null && myAsset.costs.length > 0) {
                        this.myAssetStatus.set(myAsset.id, 'COMPLETED');
                        this.myCosts.set(myAsset.id, _.cloneDeep(myAsset.costs));
                    } else {
                        this.myAssetStatus.set(myAsset.id, 'NOT COMPLETED');
                    }
                });
                this.idaUtilsService.getMySavedDirectAssets(this.mySelf).toPromise().then((mySavedDirect) => {
                    if (mySavedDirect) {
                        this.myDirects = mySavedDirect;
                        this.myDirects = _.orderBy(this.myDirects, ['myAsset.asset.name'], ['asc']);
                    }
                });
            }
        });
    }

    public selectIndirect(myIndirect: IndirectAssetMgm) {
        if (myIndirect) {
            this.refreshIndirect = true;
            setTimeout(() => {
                const indDirect = _.findIndex(this.myDirects, { id: this.selectedDirectAsset.id });
                this.selectedDirectAsset = _.cloneDeep(this.myDirects[indDirect]);
                if (this.selectedIndirectAsset) {
                    if (this.selectedIndirectAsset.id === myIndirect.id) {
                        this.selectedIndirectAsset = null;
                    } else {
                        this.selectedIndirectAsset = null;
                        this.selectedIndirectAsset = myIndirect;
                        this.ref.detectChanges();
                    }
                } else {
                    this.selectedIndirectAsset = null;
                    this.selectedIndirectAsset = myIndirect;
                    this.ref.detectChanges();
                }
                this.refreshIndirect = false;
            }, 250);
        }
    }

    public selectDirect(myDirect: DirectAssetMgm) {
        if (myDirect) {
            this.selectedIndirectAsset = null;
            this.refresh = true;
            setTimeout(() => {
                if (this.selectedDirectAsset) {
                    if (this.selectedDirectAsset.id === myDirect.id) {
                        this.selectedDirectAsset = null;
                    } else {
                        this.selectedDirectAsset = null;
                        this.selectedDirectAsset = myDirect;
                    }
                } else {
                    this.selectedDirectAsset = null;
                    this.selectedDirectAsset = myDirect;
                }
                this.refresh = false;
            }, 250);
        }
    }

    public setCostOnDirect(costType: CostType) {
        if (costType) {
            const myAssetIndex = _.findIndex(this.myAssets, { id: this.selectedDirectAsset.myAsset.id });

            if (!this.myAssets[myAssetIndex].costs) {
                this.myAssets[myAssetIndex].costs = [];
            }

            const selectedCostType: CostType = costType;

            this.isMyAssetUpdated = true;

            const costIndex = _.findIndex(this.myAssets[myAssetIndex].costs, { type: selectedCostType });
            if (costIndex !== -1) {
                this.verifyWarning(this.selectedDirectAsset.myAsset, true, true, this.myAssets[myAssetIndex].costs[costIndex]);
                // Remove the existing AttackCost inplace
                this.myAssets[myAssetIndex].costs.splice(costIndex, 1);
            } else {
                const newCost = new AttackCostMgm();
                newCost.myAsset = this.myAssets[myAssetIndex];
                newCost.type = selectedCostType;
                this.myAssets[myAssetIndex].costs.push(_.cloneDeep(newCost));
                this.verifyWarning(this.selectedDirectAsset.myAsset, true, false, this.myAssets[myAssetIndex].costs[costIndex]);
            }
        }
    }

    private verifyWarning(asset: MyAssetMgm, direct: boolean, toBeRemoved: boolean, cost?: AttackCostMgm) {
        if (!toBeRemoved) {
            if (direct) {
                this.warningDirect = false;
            } else {
                this.warningIndirect = false;
            }
            return;
        }
        const costs = this.myCosts.get(asset.id);
        if (!costs) {
            if (direct) {
                this.warningDirect = false;
            } else {
                this.warningIndirect = false;
            }
            return;
        }
        let index: number;
        if (cost && cost.id) {
            index = _.findIndex(costs, { id: cost.id });
        } else {
            index = _.findIndex(costs, { type: cost.type });
        }
        if (index === -1) {
            if (direct) {
                this.warningDirect = false;
            } else {
                this.warningIndirect = false;
            }
            return;
        } else {
            if (direct) {
                this.warningDirect = true;
            } else {
                this.warningIndirect = true;
            }
            return;
        }
    }

    public isDirectCostSelected(costType: CostType): boolean {
        if (costType) {
            const myAssetIndex = _.findIndex(this.myAssets, { id: this.selectedDirectAsset.myAsset.id });
            if (this.myAssets[myAssetIndex].costs && this.myAssets[myAssetIndex].costs.length > 0) {
                for (const iCost of this.myAssets[myAssetIndex].costs) {
                    if (iCost.type === costType) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public setCostOnIndirect(costType: CostType) {
        if (costType) {
            const myAssetIndex = _.findIndex(this.myAssets, { id: this.selectedIndirectAsset.myAsset.id });

            if (!this.myAssets[myAssetIndex].costs) {
                this.myAssets[myAssetIndex].costs = [];
            }

            const selectedCostType: CostType = costType;

            this.isMyAssetUpdated = true;

            const costIndex = _.findIndex(this.myAssets[myAssetIndex].costs, { type: selectedCostType });
            if (costIndex !== -1) {
                this.verifyWarning(this.selectedIndirectAsset.myAsset, false, true, this.myAssets[myAssetIndex].costs[costIndex]);
                // Remove the existing AttackCost inplace
                this.myAssets[myAssetIndex].costs.splice(costIndex, 1);
            } else {
                const newCost = new AttackCostMgm();
                newCost.myAsset = this.myAssets[myAssetIndex];
                newCost.type = selectedCostType;
                this.myAssets[myAssetIndex].costs.push(_.cloneDeep(newCost));
                this.verifyWarning(this.selectedIndirectAsset.myAsset, false, false, this.myAssets[myAssetIndex].costs[costIndex]);
            }
        }
    }

    public isIndirectCostSelected(costType: CostType): boolean {
        if (costType) {
            const myAssetIndex = _.findIndex(this.myAssets, { id: this.selectedIndirectAsset.myAsset.id });
            if (this.myAssets[myAssetIndex].costs && this.myAssets[myAssetIndex].costs.length > 0) {
                for (const iCost of this.myAssets[myAssetIndex].costs) {
                    if (iCost.type === costType) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public updateMyAsset(onNext: boolean) {
        if (!this.selectedDirectAsset) {
            if (onNext) {
                this.router.navigate(['/dashboard']);
                return;
            } else {
                return;
            }
        }
        this.loading = true;
        const idMyAsset = this.selectedDirectAsset.myAsset.id;
        if (this.isMyAssetUpdated) {
            this.myAssetStatus.set(idMyAsset, 'IN EVALUATION');
            const myAssetIndex = _.findIndex(this.myAssets, { id: this.selectedDirectAsset.myAsset.id });
            this.idaUtilsService.updateAsset(this.myAssets[myAssetIndex]).toPromise().then((myAsset) => {
                if (myAsset) {
                    const index = _.findIndex(this.myAssets, { id: myAsset.id });
                    if (index !== -1) {
                        this.myAssets.splice(index, 1, myAsset);
                    } else {
                        this.myAssets.push(_.cloneDeep(myAsset));
                    }
                    this.isMyAssetUpdated = false;
                    this.loading = false;
                    if (myAsset.costs && myAsset.costs.length > 0) {
                        this.myAssetStatus.set(idMyAsset, 'COMPLETED');
                    } else {
                        this.myAssetStatus.set(idMyAsset, 'NOT COMPLETED');
                    }
                    if (onNext) {
                        this.router.navigate(['/identify-asset/attack-costs']);
                    }
                }
                this.ref.detectChanges();
            }).catch(() => {
                this.loading = false;
                this.router.navigate(['/dashboard']);
            });
            if (this.selectedIndirectAsset) {
                const myAssetIndexIndirect = _.findIndex(this.myAssets, { id: this.selectedIndirectAsset.myAsset.id });
                this.idaUtilsService.updateAsset(this.myAssets[myAssetIndexIndirect]).toPromise().then((myAsset) => {
                    if (myAsset) {
                        const index = _.findIndex(this.myAssets, { id: myAsset.id });
                        if (index !== -1) {
                            this.myAssets.splice(index, 1, myAsset);
                        } else {
                            this.myAssets.push(_.cloneDeep(myAsset));
                        }
                    }
                    this.ref.detectChanges();
                });
            }
        } else {
            this.loading = false;
            this.ref.detectChanges();
            if (onNext) {
                this.router.navigate(['/dashboard']);
            }
        }
    }

}
