import { Component, OnInit } from '@angular/core';
import { RiskManagementService } from '../risk-management.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../../entities/critical-level-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { MyAssetAttackChance } from '../model/my-asset-attack-chance.model';
import { SessionStorageService } from '../../../../../../node_modules/ngx-webstorage';
import { Router } from '../../../../../../node_modules/@angular/router';
import { ValueTransformer } from '../../../../../../node_modules/@angular/compiler/src/util';
// import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
import { ITEMS_PER_PAGE } from '../../shared';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'risk-evaluation',
    templateUrl: './risk-evaluation.component.html',
    styleUrls: ['./risk-evaluation.component.css'],
})
export class RiskEvaluationComponent implements OnInit {
    private mySelf: SelfAssessmentMgm;
    public myAssets: MyAssetMgm[] = [];
    public criticalLevel: CriticalLevelMgm;
    public squareColumnElement: number[];
    public squareRowElement: number[];
    public lastSquareRowElement: number;
    public selectedRow: number;
    public selectedColumn: number;
    public mapAssetAttacks: Map<number, MyAssetAttackChance[]> = new Map<number, MyAssetAttackChance[]>();
    public loading = false;
    // public modalContent: string;
    private selectedAttacksChance: MyAssetAttackChance[];
    private closeResult: string;
    private selectedAsset: MyAssetMgm;

    constructor(
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private riskService: RiskManagementService,
        private sessionService: SessionStorageService,
        private router: Router
        // private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.loading = true;
        this.riskService.getMyAssets(this.mySelf).toPromise().then((res) => {
            if (res && res.length > 0) {
                this.myAssets = res;
                for (const myAsset of this.myAssets) {
                    this.loading = true;
                    this.riskService.getAttackChance(myAsset, this.mySelf).toPromise().then((res2) => {
                        if (res2) {
                            this.mapAssetAttacks.set(myAsset.id, res2);
                            const ordered = this.orderLevels(this.mapAssetAttacks);
                            this.mapAssetAttacks = ordered.orderedMap;
                            this.myAssets = ordered.orderedArray;
                        }
                        this.loading = false;
                    });
                }
                console.log(this.mapAssetAttacks);
            }
            this.loading = false;
        });

        this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
            if (res) {
                this.loading = true;
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
                this.loading = false;
            }
        });
    }

    public orderLevels(mapAssetAttacks: Map<number, MyAssetAttackChance[]>): {
        orderedMap: Map<number, MyAssetAttackChance[]>,
        orderedArray: MyAssetMgm[]
    } {
        const orderedMap: Map<number, MyAssetAttackChance[]> = new Map<number, MyAssetAttackChance[]>();
        const orderedArray: MyAssetMgm[] = [];
        const levelsMap: Map<number, number[]> = new Map<number, number[]>();
        for (let index = 0; index < this.myAssets.length; index++) {
            let howManyLow = 0; let howManyMedium = 0; let howManyHigh = 0;
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
        // this.modalContent = this.whichContentByCell(row, column, myAsset, type);
        this.selectedAttacksChance = this.whichAttackChanceByCell(row, column, myAsset, type);
        this.sessionService.store('selectedAttacksChence', this.selectedAttacksChance);
        this.sessionService.store('selectedAsset', myAsset);
        this.router.navigate(['/risk-mitigation']);
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
                        const likelihoodVulnerability = attack.likelihood * attack.vulnerability;
                        if (level === likelihoodVulnerability) {
                            selectedAttacks.push(attack);
                        }
                    }
                    break;
                }
                case 'critically-impact': {
                    for (const attack of attacks) {
                        const criticallyImpact = attack.critical * attack.impact;
                        if (level === criticallyImpact) {
                            selectedAttacks.push(attack);
                        }
                    }
                    break;
                }
            }
        }

        return selectedAttacks;
    }

    public whichContentByCell(row: number, column: number, myAsset: MyAssetMgm, type: string): string {
        const attacks = this.mapAssetAttacks.get(myAsset.id);
        const level = row * column;
        let content = '';

        if (attacks) {
            switch (type) {
                case 'likelihood-vulnerability': {
                    for (const attack of attacks) {
                        const likelihoodVulnerability = attack.likelihood * attack.vulnerability;
                        if (level === likelihoodVulnerability) {
                            content = content.concat(attack.attackStrategy.name, ' ');
                        }
                    }
                    break;
                }
                case 'critically-impact': {
                    for (const attack of attacks) {
                        const criticallyImpact = attack.critical * attack.impact;
                        if (level === criticallyImpact) {
                            content = content.concat(attack.attackStrategy.name, ' ');
                        }
                    }
                    break;
                }
            }
        }

        return content;
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

}
