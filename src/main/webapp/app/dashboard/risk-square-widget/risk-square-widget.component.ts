import { MyAssetAttackChance } from './../../risk-management/model/my-asset-attack-chance.model';
import * as _ from 'lodash';
import { MyAssetMgmService } from './../../entities/my-asset-mgm/my-asset-mgm.service';
import { CriticalLevelMgm } from './../../entities/critical-level-mgm/critical-level-mgm.model';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { RiskManagementService } from '../../risk-management/risk-management.service';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { ThreatAgentInterest } from '../../risk-management/model/threat-agent-interest.model';

@Component({
  selector: 'jhi-risk-square-widget',
  templateUrl: './risk-square-widget.component.html',
  styleUrls: ['risk-square-widget.component.css']
})
export class RiskSquareWidgetComponent implements OnInit {
  private mySelf: SelfAssessmentMgm;
  // TODO think on how to make the following vars dynamic
  private MAX_LIKELIHOOD = 5;
  private MAX_VULNERABILITY = 5;
  private MAX_CRITICAL = this.MAX_LIKELIHOOD * this.MAX_VULNERABILITY;
  private MAX_IMPACT = 5;
  private MAX_RISK = this.MAX_CRITICAL * this.MAX_IMPACT;

  public loadingRiskLevel = false;
  public loadingAssetsAndAttacks = false;
  public assetToolTipLoaded = false;
  public assetToolTipLoadedTimer = false;
  public isCollapsed = true;
  public criticalBostonSquareLoad = false;

  public selectedRow: number;
  public selectedColumn: number;
  public myAssets: MyAssetMgm[] = [];
  public criticalLevel: CriticalLevelMgm;
  public squareColumnElement: number[];
  public squareRowElement: number[];
  public lastSquareRowElement: number;
  public mapAssetAttacks: Map<number, MyAssetAttackChance[]> = new Map<number, MyAssetAttackChance[]>();
  public mapMaxCriticalLevel: Map<number, number[]> = new Map<number, number[]>();
  public assetsToolTip: Map<number, string> = new Map<number, string>();

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private riskService: RiskManagementService
  ) { }

  ngOnInit() {
    this.loadingRiskLevel = true;
    this.loadingAssetsAndAttacks = true;
    this.criticalBostonSquareLoad = true;
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

    this.riskService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        this.myAssets = res;
        this.myAssets = _.orderBy(this.myAssets, ['ranking'], ['desc']);
        for (const myAsset of this.myAssets) {
          this.riskService.getAttackChance(myAsset, this.mySelf).toPromise().then((res2) => {
            if (res2) {
              this.mapAssetAttacks.set(myAsset.id, res2);
              for (let i = 1; i <= 5; i++) {
                for (let j = 1; j <= 5; j++) {
                  this.whichContentByCell(i, j, myAsset, 'likelihood-vulnerability');
                }
              }
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
    if (content.length > 0) {
      content = content.substr(0, 10);
      if (attackCounter > 0) {
        content = content.concat(' +' + attackCounter);
      }
    }
    return content;
  }

  public whichCriticalContentByCell(row: number, column: number): string {
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

  public concatenateAndParse(numbers: number[]): number {
    let mapIndex = '';
    for (const elem of numbers) {
      mapIndex = mapIndex.concat(elem.toString());
    }
    return Number(mapIndex);
  }

  public whichLevel(row: number, column: number): string {
    return this.riskService.whichLevel(row, column, this.criticalLevel);
  }
}
