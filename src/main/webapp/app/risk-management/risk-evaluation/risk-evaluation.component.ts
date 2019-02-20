import { MyAssetRisk } from './../model/my-asset-risk.model';
import * as _ from 'lodash';
import { DashboardStepEnum } from './../../dashboard/models/enumeration/dashboard-step.enum';
import { DashboardService } from './../../dashboard/dashboard.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RiskManagementService } from '../risk-management.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../../entities/critical-level-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { Status } from '../../entities/enumerations/QuestionnaireStatus.enum';
import { Subscription } from 'rxjs';
import { MitigationMgm } from '../../entities/mitigation-mgm';

interface RiskPercentageElement {
    asset: MyAssetMgm;
    critical: number;
    percentage: number;
}

interface OrderBy {
    category: boolean;
    asset: boolean;
    description: boolean;
    impact: boolean;
    critical: boolean;
    risk: boolean;
    type: string;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'risk-evaluation',
    templateUrl: './risk-evaluation.component.html',
    styleUrls: ['./risk-evaluation.component.css'],
})
export class RiskEvaluationComponent implements OnInit, OnDestroy {
    public loadingRiskLevel = false;
    public loadingAssetsAndAttacks = false;
    private mySelf: SelfAssessmentMgm;
    public criticalLevel: CriticalLevelMgm;
    public squareColumnElement: number[];
    public squareRowElement: number[];
    public lastSquareRowElement: number;
    private criticalLevelSubscription: Subscription;
    public myAssetsAtRisk: MyAssetRisk[];
    public bostonSquareCells: string[][] = [];
    public riskMitigationMap: Map<number, MitigationMgm[]> = new Map<number, MitigationMgm[]>();
    public attackCosts = false;
    public assetsToolTip: Map<number, string> = new Map<number, string>();
    public assetToolTipLoaded = false;
    private dashboardStatus = DashboardStepEnum;
    public risksTangible: RiskPercentageElement[] = [];
    public risksIntangible: RiskPercentageElement[] = [];
    public noRiskInMap = false;
    public assetToolTipLoadedTimer = false;
    public orderIntangibleBy: OrderBy;
    public orderTangibleBy: OrderBy;

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

    constructor(
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private riskService: RiskManagementService,
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
        this.orderIntangibleBy = {
            category: false,
            asset: false,
            description: false,
            impact: false,
            critical: false,
            risk: false,
            type: 'desc'
        };
        this.orderTangibleBy = {
            category: false,
            asset: false,
            description: false,
            impact: false,
            critical: false,
            risk: false,
            type: 'desc'
        };
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
            if (res) {
                this.criticalLevel = res;
                this.squareColumnElement = [];
                this.squareRowElement = [];
                this.lastSquareRowElement = this.criticalLevel.side + 1;
                for (let i = 1; i <= this.criticalLevel.side; i++) {
                    this.squareColumnElement.push(i);
                    this.squareRowElement.push(i);
                }
                this.squareRowElement.push(this.criticalLevel.side + 1);
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

        this.riskService.getMyAssetsAtRisk(this.mySelf).toPromise().then((res: MyAssetRisk[]) => {
            if (res) {
                this.myAssetsAtRisk = res;
                this.myAssetsAtRisk.forEach((myAsset) => {
                    this.riskMitigationMap.set(myAsset.id, myAsset.mitigations);
                });
                this.loadingAssetsAndAttacks = false;
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

    public whichLevel(row: number, column: number): string {
        return this.riskService.whichLevel(row, column, this.criticalLevel);
    }

    public whichCriticalContentByCell(row: number, column: number): string {
        if (this.bostonSquareCells.length >= row) {
            if (this.bostonSquareCells[row - 1] && this.bostonSquareCells[row - 1].length >= column) {
                return this.bostonSquareCells[row - 1][column - 1];
            }
        }
        let content = '';
        let fullContent = '';
        let criticalAsset = 0;
        if (this.myAssetsAtRisk.length === 0) {
            return content;
        }
        for (const myAsset of this.myAssetsAtRisk) {
            if (!myAsset.impact && !myAsset.risk) {
                continue;
            }
            if (column === myAsset.impact && Math.pow(row - 1, 2) < myAsset.critical && myAsset.critical <= Math.pow(row, 2)) {
                if (content.length === 0) {
                    content = myAsset.asset.name;
                } else {
                    criticalAsset++;
                }
                fullContent = fullContent.concat(myAsset.asset.name + ', ');
            }
            const risk: RiskPercentageElement = {
                asset: myAsset,
                critical: myAsset.critical,
                percentage: myAsset.risk
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
        if (!this.bostonSquareCells[row - 1]) {
            this.bostonSquareCells[row - 1] = [];
        }
        this.bostonSquareCells[row - 1][column - 1] = content;
        return content;
    }

    public concatenateAndParse(numbers: number[]): number {
        let mapIndex = '';
        for (const elem of numbers) {
            mapIndex = mapIndex.concat(elem.toString());
        }
        return Number(mapIndex);
    }

    private resetOrder(witchCategory: string) {
        if (witchCategory === 'TANGIBLE') {
            this.orderTangibleBy.asset = false;
            this.orderTangibleBy.category = false;
            this.orderTangibleBy.critical = false;
            this.orderTangibleBy.description = false;
            this.orderTangibleBy.impact = false;
            this.orderTangibleBy.risk = false;
            this.orderTangibleBy.type = 'desc';
        } else {
            this.orderIntangibleBy.asset = false;
            this.orderIntangibleBy.category = false;
            this.orderIntangibleBy.critical = false;
            this.orderIntangibleBy.description = false;
            this.orderIntangibleBy.impact = false;
            this.orderIntangibleBy.risk = false;
            this.orderIntangibleBy.type = 'desc';
        }
    }
    public tableOrderBy(orderColumn: string, category: string, desc: boolean) {
        if (category === 'TANGIBLE') {
            this.resetOrder('TANGIBLE');
            if (desc) {
                this.orderTangibleBy.type = 'desc';
            } else {
                this.orderTangibleBy.type = 'asc';
            }
            switch (orderColumn.toLowerCase()) {
                case ('category'): {
                    this.orderTangibleBy.category = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.assetcategory.name, ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.assetcategory.name, ['asc']);
                    }
                    break;
                }
                case ('asset'): {
                    this.orderTangibleBy.asset = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.name, ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.name, ['asc']);
                    }
                    break;
                }
                case ('description'): {
                    this.orderTangibleBy.description = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.description, ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.asset.description, ['asc']);
                    }
                    break;
                }
                case ('impact'): {
                    this.orderTangibleBy.impact = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.impact, ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, (elem: RiskPercentageElement) => elem.asset.impact, ['asc']);
                    }
                    break;
                }
                case ('critical'): {
                    this.orderTangibleBy.critical = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, ['critical'], ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, ['critical'], ['asc']);
                    }
                    break;
                }
                case ('risk'): {
                    this.orderTangibleBy.risk = true;
                    if (desc) {
                        this.risksTangible = _.orderBy(this.risksTangible, ['percentage'], ['desc']);
                    } else {
                        this.risksTangible = _.orderBy(this.risksTangible, ['percentage'], ['asc']);
                    }
                    break;
                }
            }
        } else {
            this.resetOrder('INTANGIBLE');
            if (desc) {
                this.orderIntangibleBy.type = 'desc';
            } else {
                this.orderIntangibleBy.type = 'asc';
            }
            switch (orderColumn.toLowerCase()) {
                case ('category'): {
                    this.orderIntangibleBy.category = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.assetcategory.name, ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.assetcategory.name, ['asc']);
                    }
                    break;
                }
                case ('asset'): {
                    this.orderIntangibleBy.asset = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.name, ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.name, ['asc']);
                    }
                    break;
                }
                case ('description'): {
                    this.orderIntangibleBy.description = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.description, ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.asset.description, ['asc']);
                    }
                    break;
                }
                case ('impact'): {
                    this.orderIntangibleBy.impact = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.impact, ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, (elem: RiskPercentageElement) => elem.asset.impact, ['asc']);
                    }
                    break;
                }
                case ('critical'): {
                    this.orderIntangibleBy.critical = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['critical'], ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['critical'], ['asc']);
                    }
                    break;
                }
                case ('risk'): {
                    this.orderIntangibleBy.risk = true;
                    if (desc) {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['percentage'], ['desc']);
                    } else {
                        this.risksIntangible = _.orderBy(this.risksIntangible, ['percentage'], ['asc']);
                    }
                    break;
                }
            }
        }
    }
}
