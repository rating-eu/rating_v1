import { AttackCostFormula } from './../model/attack-cost-formula.model';
import * as _ from 'lodash';
import { DashboardStepEnum } from './../../dashboard/models/enumeration/dashboard-step.enum';
import { DashboardService } from './../../dashboard/dashboard.service';
import { ThreatAgentInterest } from './../model/threat-agent-interest.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RiskManagementService } from '../risk-management.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../../entities/critical-level-mgm';
import { MyAssetMgm, MyAssetMgmService } from '../../entities/my-asset-mgm';
import { MyAssetAttackChance } from '../model/my-asset-attack-chance.model';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { Status } from '../../entities/enumerations/QuestionnaireStatus.enum';
import { Subscription } from 'rxjs';
import { MitigationMgm } from '../../entities/mitigation-mgm';

interface RiskPercentageElement {
    asset: MyAssetMgm;
    critical: number;
    percentage: number;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'risk-evaluation',
    templateUrl: './risk-evaluation.component.html',
    styleUrls: ['./risk-evaluation.component.css'],
})
export class RiskEvaluationComponent implements OnInit, OnDestroy {
    private mySelf: SelfAssessmentMgm;
    private criticalLevelSubscription: Subscription;
    private selectedAttacksChance: MyAssetAttackChance[];
    private dashboardStatus = DashboardStepEnum;
    private mapAssetThreats: Map<number, ThreatAgentInterest[]> = new Map<number, ThreatAgentInterest[]>();
    private impactTable: AttackCostFormula[] = [];
    // TODO think on how to make the following vars dynamic
    private MAX_LIKELIHOOD = 5;
    private MAX_VULNERABILITY = 5;
    private MAX_CRITICAL = this.MAX_LIKELIHOOD * this.MAX_VULNERABILITY;
    private MAX_IMPACT = 5;
    private MAX_RISK = this.MAX_CRITICAL * this.MAX_IMPACT;

    public attackCosts = false;
    public selectedAsset: MyAssetMgm;
    public myAssets: MyAssetMgm[] = [];
    public mySearchedAssets: MyAssetMgm[] = [];
    public criticalLevel: CriticalLevelMgm;
    public squareColumnElement: number[];
    public squareRowElement: number[];
    public lastSquareRowElement: number;
    public selectedRow: number;
    public selectedColumn: number;
    public mapAssetAttacks: Map<number, MyAssetAttackChance[]> = new Map<number, MyAssetAttackChance[]>();
    public riskMitigationMap: Map<number, MitigationMgm[]> = new Map<number, MitigationMgm[]>();
    public threatAgentInterest: ThreatAgentInterest[] = [];
    public mapMaxCriticalLevel: Map<number, number[]> = new Map<number, number[]>();
    public noRiskInMap = false;
    public loadingRiskLevel = false;
    public detailsLoading = false;
    public loadingAssetsAndAttacks = false;
    public criticalBostonSquareLoad = true;
    public attacksToolTipLoaded = false;
    public attacksToolTipLoadedTimer = false;
    public assetToolTipLoaded = false;
    public assetToolTipLoadedTimer = false;
    public loadingImpactTable = false;
    public tangibleAssetAtRiskPaginator = {
        id: 'tangible_asset_at_risk_paginator',
        itemsPerPage: 7,
        currentPage: 1
    };
    public intangibleAssetAtRiskPaginator = {
        id: 'intangible_asset_at_risk_paginator',
        itemsPerPage: 7,
        currentPage: 1
    };
    public risksTangible: RiskPercentageElement[] = [];
    public risksIntangible: RiskPercentageElement[] = [];
    public attacksToolTip: Map<number, string> = new Map<number, string>();
    public assetsToolTip: Map<number, string> = new Map<number, string>();
    public directImpactTable: AttackCostFormula[] = [];
    public indirectImpactTable: AttackCostFormula[] = [];
    public selectedImpact: AttackCostFormula;
    public impactFormula: string;

    constructor(
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private riskService: RiskManagementService,
        private sessionService: SessionStorageService,
        private router: Router,
        private myAssetService: MyAssetMgmService,
        private dashService: DashboardService
    ) {
    }

    onIntangibleRiskPageChange(number: number) {
        this.intangibleAssetAtRiskPaginator.currentPage = number;
    }

    onTangibleRiskPageChange(number: number) {
        this.tangibleAssetAtRiskPaginator.currentPage = number;
    }

    ngOnInit() {
        this.loadingRiskLevel = true;
        this.loadingAssetsAndAttacks = true;
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();

        this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
            if (res) {
                this.criticalLevel = res;
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
            } else {
                this.loadingRiskLevel = false;
            }
        }).catch(() => {
            this.loadingRiskLevel = false;
        });

        this.criticalLevelSubscription = this.riskService.subscribeForCriticalLevel().subscribe((res) => {
            if (res) {
                this.criticalLevel = res;
            }
        });

        this.riskService.getMyAssets(this.mySelf).toPromise().then((res) => {
            if (res && res.length > 0) {
                this.myAssets = res;
                this.mySearchedAssets = res;
                this.myAssets = _.orderBy(this.myAssets, ['ranking'], ['desc']);
                for (const myAsset of this.myAssets) {
                    this.riskService.getAttackChance(myAsset, this.mySelf).toPromise().then((res2) => {
                        if (res2) {
                            this.mapAssetAttacks.set(myAsset.id, res2);
                            let mitigations: MitigationMgm[] = [];
                            res2.forEach((item) => {
                                if (mitigations.length === 0) {
                                    mitigations = item.attackStrategy.mitigations;
                                } else {
                                    mitigations.concat(mitigations, item.attackStrategy.mitigations);
                                }
                                mitigations = _.uniqBy(mitigations, 'id');
                            });
                            if (this.riskMitigationMap.size === 0) {
                                this.riskMitigationMap.set(myAsset.id, mitigations);
                            } else {
                                let tempArray: MitigationMgm[] = this.riskMitigationMap.get(myAsset.id);
                                if (tempArray) {
                                    tempArray.concat(tempArray, mitigations);
                                    tempArray = _.uniqBy(tempArray, 'id');
                                    this.riskMitigationMap.set(myAsset.id, tempArray);
                                } else {
                                    this.riskMitigationMap.set(myAsset.id, mitigations);
                                }
                            }
                            for (let i = 1; i <= 5; i++) {
                                for (let j = 1; j <= 5; j++) {
                                    this.whichContentByCell(i, j, myAsset, 'likelihood-vulnerability');
                                }
                            }
                        }
                    });
                    this.riskService.getThreatAgentsInterests(myAsset, this.mySelf).toPromise().then((res3) => {
                        if (res3) {
                            this.mapAssetThreats.set(myAsset.id, res3);
                        }
                    });
                }
                if (this.loadingAssetsAndAttacks) {
                    setTimeout(() => {
                        this.loadingAssetsAndAttacks = false;
                    }, 5000);
                }
            } else {
                this.loadingAssetsAndAttacks = false;
            }
        }).catch(() => {
            this.loadingAssetsAndAttacks = false;
        });

        this.dashService.getStatusFromServer(this.mySelf, this.dashboardStatus.ATTACK_RELATED_COSTS).toPromise().then((res) => {
            if (Status[res] === Status.EMPTY || Status[res] === Status.PENDING) {
                this.attackCosts = false;
            } else {
                this.attackCosts = true;
            }
        });
    }

    ngOnDestroy() {
        this.criticalLevelSubscription.unsubscribe();
    }

    public search(searchString: string) {
        if (searchString) {
            if (searchString.length < 3) {
                return;
            } else {
                this.mySearchedAssets = [];
                this.myAssets.forEach((item) => {
                    if (item.asset.name.toLowerCase().search(searchString.toLowerCase()) !== -1) {
                        this.mySearchedAssets.push(_.clone(item));
                    }
                });
            }
        } else {
            this.mySearchedAssets = this.myAssets;
        }
    }

    public selectAsset(asset: MyAssetMgm) {
        this.detailsLoading = true;
        if (!this.selectedAsset) {
            this.selectedAsset = asset;
            this.threatAgentInterest = this.mapAssetThreats.get(asset.id);
            this.getImpactFormula(this.selectedAsset);
            this.getImpactInfo(this.selectedAsset);
        } else if (this.selectedAsset.id === asset.id) {
            this.selectedAsset = null;
        } else {
            this.selectedAsset = asset;
            this.threatAgentInterest = this.mapAssetThreats.get(asset.id);
            this.getImpactFormula(this.selectedAsset);
            this.getImpactInfo(this.selectedAsset);
        }
        setTimeout(() => {
            this.detailsLoading = false;
        }, 500);
    }

    public selectAttackCost(impact: AttackCostFormula) {
        if (!this.selectedImpact) {
            this.selectedImpact = impact;
        } else {
            if (this.selectedImpact.attackCost.id === impact.attackCost.id) {
                this.selectedImpact = null;
            } else {
                this.selectedImpact = impact;
            }
        }
    }
    public isMoney(type: string): boolean {
        if (type.toLowerCase().indexOf('cost') !== -1 || type.toLowerCase().indexOf('revenue') !== -1) {
            return true;
        } else {
            return false;
        }
    }

    public isFraction(type: string): boolean {
        if (type.toLowerCase().indexOf('fraction') !== -1) {
            return true;
        } else {
            return false;
        }
    }

    private getImpactFormula(myAsset: MyAssetMgm) {
        this.riskService.getImpactFormulaByMyAsset(this.mySelf, myAsset).toPromise().then((res) => {
            if (res) {
                this.impactFormula = res.toString();
            } else {
                this.impactFormula = '';
            }
        });
    }

    private getImpactInfo(myAsset: MyAssetMgm) {
        this.loadingImpactTable = true;
        this.riskService.getAttackCostsFormulaByMyAsset(this.mySelf, myAsset).toPromise().then((res) => {
            if (res) {
                this.impactTable = res;
                this.impactTable.forEach((item) => {
                    if (item.direct) {
                        this.directImpactTable.push(item);
                    } else {
                        this.indirectImpactTable.push(item);
                    }
                });
                this.loadingImpactTable = false;
            } else {
                this.loadingImpactTable = false;
            }
        }).catch(() => {
            this.loadingImpactTable = false;
        });
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
    }

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
            const criticalValue = lStore[1] * lStore[1];
            const riskPercentage = this.evaluateRiskPercentage(criticalValue, myAsset);
            const risk: RiskPercentageElement = {
                asset: myAsset,
                critical: criticalValue,
                percentage: riskPercentage
            };
            if (risk.asset.asset.assetcategory.type.toString() === 'TANGIBLE') {
                if (this.risksTangible.length === 0) {
                    this.risksTangible.push(_.cloneDeep(risk));
                } else {
                    const index = _.findIndex(this.risksTangible, (elem) => {
                        return elem.asset.id === myAsset.id;
                    });
                    if (index !== -1) {
                        this.risksTangible.splice(index, 1, _.cloneDeep(risk));
                    } else {
                        this.risksTangible.push(_.cloneDeep(risk));
                    }
                }
                this.risksTangible = _.orderBy(this.risksTangible, ['percentage'], ['desc']);
            } else {
                if (this.risksIntangible.length === 0) {
                    this.risksIntangible.push(_.cloneDeep(risk));
                } else {
                    const index = _.findIndex(this.risksIntangible, (elem) => {
                        return elem.asset.id === myAsset.id;
                    });
                    if (index !== -1) {
                        this.risksIntangible.splice(index, 1, _.cloneDeep(risk));
                    } else {
                        this.risksIntangible.push(_.cloneDeep(risk));
                    }
                }
                this.risksIntangible = _.orderBy(this.risksIntangible, ['percentage'], ['desc']);
            }
        }
        if (this.risksIntangible.length === 0 && this.risksTangible.length === 0) {
            this.noRiskInMap = true;
        } else {
            this.noRiskInMap = false;
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
            content = content.substr(0, 10);
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
