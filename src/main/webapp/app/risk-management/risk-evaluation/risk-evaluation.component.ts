import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RiskManagementService } from '../risk-management.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../../entities/critical-level-mgm';
import { MyAssetMgm, MyAssetMgmService } from '../../entities/my-asset-mgm';
import { MyAssetAttackChance } from '../model/my-asset-attack-chance.model';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
// import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
import { ITEMS_PER_PAGE } from '../../shared';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'risk-evaluation',
    templateUrl: './risk-evaluation.component.html',
    styleUrls: ['./risk-evaluation.component.css'],
})
export class RiskEvaluationComponent implements OnInit, OnDestroy {
    private mySelf: SelfAssessmentMgm;
    public myAssets: MyAssetMgm[] = [];
    public criticalLevel: CriticalLevelMgm;
    private criticalLevelSubscription: Subscription;
    public squareColumnElement: number[];
    public squareRowElement: number[];
    public lastSquareRowElement: number;
    public selectedRow: number;
    public selectedColumn: number;
    public mapAssetAttacks: Map<number, MyAssetAttackChance[]> = new Map<number, MyAssetAttackChance[]>();
    public mapMaxCriticalLevel: Map<number, number[]> = new Map<number, number[]>();
    public noRiskInMap = false;
    public loadingRiskLevel = false;
    public loadingAssetsAndAttacks = false;
    public criticalBostonSquareLoad = true;
    public attacksToolTipLoaded = false;
    public attacksToolTipLoadedTimer = false;
    public assetToolTipLoaded = false;
    public assetToolTipLoadedTimer = false;
    public riskPaginator = {
        id: 'risk_paginator',
        itemsPerPage: 7,
        currentPage: 1
    };
    // public modalContent: string;
    private selectedAttacksChance: MyAssetAttackChance[];
    private closeResult: string;
    private selectedAsset: MyAssetMgm;
    public riskPercentageMap: Map<number/*MyAsset.ID*/, number/*RiskPercentage*/> = new Map<number, number>();

    public attacksToolTip: Map<number, string> = new Map<number, string>();
    public assetsToolTip: Map<number, string> = new Map<number, string>();

    // TODO think on how to make the following vars dynamic
    private MAX_LIKELIHOOD = 5;
    private MAX_VULNERABILITY = 5;
    private MAX_CRITICAL = this.MAX_LIKELIHOOD * this.MAX_VULNERABILITY;
    private MAX_IMPACT = 5;
    private MAX_RISK = this.MAX_CRITICAL * this.MAX_IMPACT;

    constructor(
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private riskService: RiskManagementService,
        private sessionService: SessionStorageService,
        private router: Router,
        private myAssetService: MyAssetMgmService,
        private ref: ChangeDetectorRef
        // private modalService: NgbModal
    ) {
    }

    onRiskPageChange(number: number) {
        this.riskPaginator.currentPage = number;
    }

    ngOnInit() {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();

        this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
            if (res) {
                this.loadingRiskLevel = true;
                this.criticalLevel = res;
                console.log(this.criticalLevel);
                this.squareColumnElement = [];
                this.squareRowElement = [];
                this.lastSquareRowElement = this.criticalLevel.side + 1;
                for (let i = 1; i <= this.criticalLevel.side; i++) {
                    this.squareColumnElement.push(i);
                }
                for (let i = 1; i <= this.criticalLevel.side + 1; i++) {
                    this.squareRowElement.push(i);
                }
                this.loadingRiskLevel = false;
            }
        });

        this.criticalLevelSubscription = this.riskService.subscribeForCriticalLevel().subscribe((res) => {
            if (res) {
                this.criticalLevel = res;
            }
        });

        this.riskService.getMyAssets(this.mySelf).toPromise().then((res) => {
            if (res && res.length > 0) {
                this.myAssets = res;
                this.loadingAssetsAndAttacks = true;
                for (const myAsset of this.myAssets) {
                    this.riskService.getAttackChance(myAsset, this.mySelf).toPromise().then((res2) => {
                        if (res2) {
                            this.mapAssetAttacks.set(myAsset.id, res2);
                            // const ordered = this.orderLevels(this.mapAssetAttacks);
                            // this.mapAssetAttacks = ordered.orderedMap;
                            // this.myAssets = ordered.orderedArray;
                        }
                    });
                }
                this.loadingAssetsAndAttacks = false;
                // this.ref.detectChanges();
                console.log(this.mapAssetAttacks);
            }
        });
    }

    ngOnDestroy() {
        this.criticalLevelSubscription.unsubscribe();
    }

    public orderLevels(mapAssetAttacks: Map<number, MyAssetAttackChance[]>): {
        orderedMap: Map<number, MyAssetAttackChance[]>,
        orderedArray: MyAssetMgm[]
    } {
        const orderedMap: Map<number, MyAssetAttackChance[]> = new Map<number, MyAssetAttackChance[]>();
        const orderedArray: MyAssetMgm[] = [];
        const levelsMap: Map<number, number[]> = new Map<number, number[]>();
        for (let index = 0; index < this.myAssets.length; index++) {
            let howManyLow = 0;
            let howManyMedium = 0;
            let howManyHigh = 0;
            for (let i = 0; i < this.squareRowElement.length; i++) {
                for (let j = 0; j < this.squareColumnElement.length; j++) {
                    const attacksLV = this.whichAttackChanceByCell(i, j, this.myAssets[index], 'likelihood-vulnerability').length;
                    const attackCI = this.whichAttackChanceByCell(i, j, this.myAssets[index], 'critically-impact').length;
                    const attacksMax = _.max([attacksLV, attackCI]);
                    switch (this.whichLevel(i, j)) {
                        case 'low': {
                            howManyLow = howManyLow + attacksMax;
                            break;
                        }
                        case 'medium': {
                            howManyMedium = howManyMedium + attacksMax;
                            break;
                        }
                        case 'high': {
                            howManyHigh = howManyHigh + attacksMax;
                            break;
                        }
                    }
                }
            }
            levelsMap.set(this.myAssets[index].id, [howManyLow, howManyMedium, howManyHigh]);
        }
        mapAssetAttacks.forEach((value, key) => {
            // find max
            let max = 0;
            let maxAssetId = 0;
            levelsMap.forEach((value2, key2) => {
                if (value2[2] > max) {
                    max = value2[2];
                    maxAssetId = key2;
                }
            });
            orderedMap.set(maxAssetId, value);
            const index = _.findIndex(this.myAssets, (myAsset) => myAsset.id === maxAssetId);
            orderedArray.push(this.myAssets[index]);
            levelsMap.delete(maxAssetId);
        });
        return {
            'orderedMap': orderedMap,
            'orderedArray': orderedArray
        };
    }

    public setMyAssetImpact(myAsset: MyAssetMgm, impact: number) {
        this.criticalBostonSquareLoad = true;
        this.assetToolTipLoaded = false;
        this.assetToolTipLoadedTimer = false;
        console.log(myAsset);
        console.log(impact);

        myAsset.impact = impact;

        this.myAssetService.update(myAsset).toPromise().then((res: HttpResponse<MyAssetMgm>) => {
            const myAssetRes = res.body;
            const index = _.findIndex(this.myAssets, { id: myAssetRes.id });
            this.myAssets.splice(index, 1, myAssetRes);
            this.criticalBostonSquareLoad = false;
            if (!this.assetToolTipLoaded && !this.assetToolTipLoadedTimer) {
                this.assetToolTipLoadedTimer = true;
                setTimeout(() => {
                    this.assetToolTipLoaded = true;
                }, 1500);
            }
        });
    }

    public selectAsset(asset: MyAssetMgm) {
        if (!this.selectedAsset) {
            this.selectedAsset = asset;
        } else if (this.selectedAsset.id === asset.id) {
            this.selectedAsset = null;
        } else {
            this.selectedAsset = asset;
        }
    }

    public isAssetCollapsed(asset: MyAssetMgm): boolean {
        if (!this.selectedAsset) {
            return true;
        }
        if (this.selectedAsset.id === asset.id) {
            return false;
        }
        return true;
    }

    public whichLevel(row: number, column: number): string {
        return this.riskService.whichLevel(row, column, this.criticalLevel);
    }

    public loadContent(row: number, column: number, myAsset: MyAssetMgm, type: string, content: any) {
        // this.modalContent = this.(row, column, myAsset, type);
        this.selectedAttacksChance = this.whichAttackChanceByCell(row, column, myAsset, type);
        this.sessionService.store('selectedAttacksChence', this.selectedAttacksChance);
        this.sessionService.store('selectedAsset', myAsset);
        this.router.navigate(['/risk-management/risk-mitigation']);
        /*
         this.modalService.open(content).result.then((result) => {
         this.closeResult = `Closed with: ${result}`;
         }, (reason) => {
         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
         });
         */
    }

    /*
     private getDismissReason(reason: any): string {
     if (reason === ModalDismissReasons.ESC) {
     return 'by pressing ESC';
     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
     return 'by clicking on a backdrop';
     } else {
     return `with: ${reason}`;
     }
     }
     */

    public whichAttackChanceByCell(row: number, column: number, myAsset: MyAssetMgm, type: string): MyAssetAttackChance[] {
        const attacks = this.mapAssetAttacks.get(myAsset.id);
        const level = row * column;
        const selectedAttacks: MyAssetAttackChance[] = [];
        if (attacks) {
            switch (type) {
                case 'likelihood-vulnerability': {
                    for (const attack of attacks) {
                        const likelihoodVulnerability = Math.round(attack.likelihood) * Math.round(attack.vulnerability);
                        if (level === likelihoodVulnerability && Math.round(attack.likelihood) === row && column === Math.round(attack.vulnerability)) {
                            selectedAttacks.push(attack);
                        }
                    }
                    break;
                }
                case 'critically-impact': {
                    for (const attack of attacks) {
                        const criticallyImpact = Math.round(attack.critical) * Math.round(attack.impact);
                        if (level === criticallyImpact && Math.round(attack.critical) === row && Math.round(attack.impact) === column) {
                            selectedAttacks.push(attack);
                        }
                    }
                    break;
                }
            }
        }

        return selectedAttacks;
    }

    public whichCriticalContentByCell(row: number, column: number): string {
        const level = row * column;
        let content = '';
        let fullContent = '';
        let criticalAsset = 0;
        if (this.myAssets.length === 0) {
            return content;
        }
        for (const myAsset of this.myAssets) {
            if (!myAsset.impact) {
                continue;
            }
            const attacks = this.mapAssetAttacks.get(myAsset.id);
            if (!attacks) {
                continue;
            }
            const lStore = this.mapMaxCriticalLevel.get(myAsset.id);
            if (!lStore) {
                continue;
            }
            for (const attack of attacks) {
                const likelihoodVulnerability = Math.round(attack.likelihood) * Math.round(attack.vulnerability);
                if (lStore[0] === likelihoodVulnerability && column === myAsset.impact && lStore[1] === row) {
                    if (content.length === 0) {
                        content = myAsset.asset.name;
                    } else {
                        criticalAsset++;
                    }
                    fullContent = fullContent.concat(myAsset.asset.name + ', ');
                    break;
                }
            }
            const critical = lStore[1] * lStore[1];
            const riskPercentage = this.evaluateRiskPercentage(critical, myAsset);
            this.riskPercentageMap.set(myAsset.id, riskPercentage);
        }
        if (this.riskPercentageMap.size === 0) {
            this.noRiskInMap = true;
        }
        content = content.trim();
        const key = row.toString() + column.toString();
        this.assetsToolTip.set(Number(key), fullContent.substr(0, fullContent.length - 2));
        if (!this.assetToolTipLoaded && !this.assetToolTipLoadedTimer) {
            this.assetToolTipLoadedTimer = true;
            setTimeout(() => {
                this.assetToolTipLoaded = true;
            }, 1000);
        }
        if (content.length > 0) {
            content = content.substr(0, 12);
            if (criticalAsset > 0) {
                content = content.concat(' +' + criticalAsset);
            }
        }
        return content;
    }

    public whichContentByCell(row: number, column: number, myAsset: MyAssetMgm, type: string): string {
        const attacks = this.mapAssetAttacks.get(myAsset.id);
        const level = row * column;
        let content = '';
        let fullContent = '';
        let attackCounter = 0;
        if (attacks) {
            switch (type) {
                case 'likelihood-vulnerability': {
                    for (const attack of attacks) {
                        const likelihoodVulnerability = Math.round(attack.likelihood) * Math.round(attack.vulnerability);
                        if (level === likelihoodVulnerability && Math.round(attack.likelihood) === row && column === Math.round(attack.vulnerability)) {
                            if (this.mapMaxCriticalLevel.has(myAsset.id)) {
                                const lStore = this.mapMaxCriticalLevel.get(myAsset.id);
                                if (lStore[0] < level) {
                                    this.mapMaxCriticalLevel.set(myAsset.id, [level, row]);
                                }
                            } else {
                                this.mapMaxCriticalLevel.set(myAsset.id, [level, row]);
                                if (this.criticalBostonSquareLoad) {
                                    setTimeout(() => {
                                        this.criticalBostonSquareLoad = false;
                                    }, 5000);
                                }
                            }
                            if (content.length === 0) {
                                content = attack.attackStrategy.name;
                            } else {
                                attackCounter++;
                            }
                            fullContent = fullContent.concat(attack.attackStrategy.name + ', ');
                        }
                    }
                    break;
                }
                case 'critically-impact': {
                    for (const attack of attacks) {
                        const criticallyImpact = attack.critical * attack.impact;
                        if (level === criticallyImpact && attack.critical === row && column === attack.impact) {
                            if (content.length === 0) {
                                content = attack.attackStrategy.name;
                            } else {
                                attackCounter++;
                            }
                        }
                    }
                    break;
                }
            }
        }
        content = content.trim();
        this.attacksToolTip.set(Number(myAsset.id.toString() + row.toString() + column.toString()), fullContent.substr(0, fullContent.length - 2));
        if (!this.attacksToolTipLoaded && !this.attacksToolTipLoadedTimer) {
            this.attacksToolTipLoadedTimer = true;
            setTimeout(() => {
                this.attacksToolTipLoaded = true;
            }, 2500);
        }
        if (content.length > 0) {
            content = content.substr(0, 12);
            if (attackCounter > 0) {
                content = content.concat(' +' + attackCounter);
            }
        }
        return content;
    }

    public concatenateAndParse(numbers: number[]): number {
        let mapIndex = '';
        for (const elem of numbers) {
            mapIndex = mapIndex.concat(elem.toString());
        }
        return Number(mapIndex);
    }

    public getAttacksTooTip(myAssetId: number, row: number, column: number): string {
        if (this.attacksToolTip.size === 0) {
            return '';
        }
        const key = Number(myAssetId.toString() + row.toString() + column.toString());
        if (this.attacksToolTip.has(Number(key))) {
            return this.attacksToolTip.get(Number(key));
        }
        return '';
    }

    public selectedMatrixCell(row: number, column: number) {
        if (this.selectedColumn === column && this.selectedRow === row) {
            this.selectedColumn = undefined;
            this.selectedRow = undefined;
            // Logica GUI in caso di click su stesso div
        } else {
            this.selectedRow = row;
            this.selectedColumn = column;
            // Logica GUI in caso di div su div differente o nuovo div
        }
    }

    private evaluateRiskPercentage(critical: number, myAsset: MyAssetMgm): number {
        const risk = critical * (myAsset.impact !== undefined ? myAsset.impact : 0);
        const normalizedRisk = risk / this.MAX_RISK;
        return Number(normalizedRisk.toFixed(2));
    }
}
