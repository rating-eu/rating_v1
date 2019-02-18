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
