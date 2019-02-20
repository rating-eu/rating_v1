import { MitigationMgm } from './../../entities/mitigation-mgm/mitigation-mgm.model';
import * as _ from 'lodash';
import { DashboardStepEnum } from './../models/enumeration/dashboard-step.enum';
import { DashboardService, DashboardStatus, Status } from './../dashboard.service';
import { MyAssetAttackChance } from './../../risk-management/model/my-asset-attack-chance.model';
import { RiskManagementService } from './../../risk-management/risk-management.service';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import { Component, OnInit } from '@angular/core';
import { AssetType } from '../../entities/asset-category-mgm';

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
  selector: 'jhi-asset-at-risk-widget',
  templateUrl: './asset-at-risk-widget.component.html',
  styleUrls: ['asset-at-risk-widget.component.css']
})
export class AssetAtRiskWidgetComponent implements OnInit {
  private mySelf: SelfAssessmentMgm;
  public noRiskInMap = false;
  public loading = false;
  public isCollapsed = true;
  public risksTangible: RiskPercentageElement[] = [];
  public risksIntangible: RiskPercentageElement[] = [];
  public mapAssetAttacks: Map<number, MyAssetAttackChance[]> = new Map<number, MyAssetAttackChance[]>();
  public riskMitigationMap: Map<number, MitigationMgm[]> = new Map<number, MitigationMgm[]>();
  public mapMaxCriticalLevel: Map<number, number[]> = new Map<number, number[]>();
  public myAssets: MyAssetMgm[] = [];
  public orderIntangibleBy: OrderBy;
  public orderTangibleBy: OrderBy;
  private status: DashboardStatus;
  private dashboardStatus = DashboardStepEnum;
  private MAX_LIKELIHOOD = 5;
  private MAX_VULNERABILITY = 5;
  private MAX_CRITICAL = this.MAX_LIKELIHOOD * this.MAX_VULNERABILITY;
  private MAX_IMPACT = 5;
  private MAX_RISK = this.MAX_CRITICAL * this.MAX_IMPACT;

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
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.status = this.dashService.getStatus();
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
    this.riskService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        this.myAssets = res;
        for (const myAsset of this.myAssets) {
          this.riskService.getAttackChance(myAsset, this.mySelf).toPromise().then((res2) => {
            if (res2) {
              this.mapAssetAttacks.set(myAsset.id, res2);
              for (let i = 1; i <= 5; i++) {
                for (let j = 1; j <= 5; j++) {
                  this.whichContentByCell(i, j, myAsset, 'likelihood-vulnerability');
                }
              }
              const lStore = this.mapMaxCriticalLevel.get(myAsset.id);
              if (myAsset.impact && lStore) {
                const criticalValue = lStore[1] * lStore[1];
                const riskPercentage = this.evaluateRiskPercentage(criticalValue, myAsset);
                const risk: RiskPercentageElement = {
                  asset: myAsset,
                  critical: criticalValue,
                  percentage: riskPercentage
                };
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
                  this.orderTangibleBy.risk = true;
                  this.orderTangibleBy.type = 'desc';
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
                  this.orderIntangibleBy.risk = true;
                  this.orderIntangibleBy.type = 'desc';
                }
              }
            }
            if (this.risksIntangible.length === 0 && this.risksTangible.length === 0) {
              this.noRiskInMap = true;
            } else {
              this.noRiskInMap = false;
            }
          });
        }
        if (this.loading) {
          setTimeout(() => {
            this.loading = false;
          }, 10000);
        }
      } else {
        this.loading = false;
      }
    }).catch(() => {
      this.loading = false;
    });
    this.dashService.getStatusFromServer(this.mySelf, this.dashboardStatus.RISK_EVALUATION).toPromise().then((res) => {
      this.status.riskEvaluationStatus = Status[res];
      this.dashService.updateStepStatus(DashboardStepEnum.RISK_EVALUATION, this.status.riskEvaluationStatus);
    });
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

  onIntangibleRiskPageChange(number: number) {
    this.intangibleAssetAtRiskPaginator.currentPage = number;
  }

  onTangibleRiskPageChange(number: number) {
    this.tangibleAssetAtRiskPaginator.currentPage = number;
  }

  private evaluateRiskPercentage(critical: number, myAsset: MyAssetMgm): number {
    const risk = critical * (myAsset.impact !== undefined ? myAsset.impact : 0);
    const normalizedRisk = risk / this.MAX_RISK;
    return Number(normalizedRisk.toFixed(2));
  }

  public whichContentByCell(row: number, column: number, myAsset: MyAssetMgm, type: string) {
    const attacks = this.mapAssetAttacks.get(myAsset.id);
    const level = row * column;
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
              }
            }
          }
          break;
        }
      }
    }
  }
}
