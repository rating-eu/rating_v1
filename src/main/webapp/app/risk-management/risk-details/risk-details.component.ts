import { MyAssetAttackChance } from './../model/my-asset-attack-chance.model';
import { MyAssetMgmService } from './../../entities/my-asset-mgm/my-asset-mgm.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AttackCostFormula } from './../model/attack-cost-formula.model';
import { CriticalLevelMgm } from './../../entities/critical-level-mgm/critical-level-mgm.model';
import * as _ from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RiskManagementService } from '../risk-management.service';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Subscription } from 'rxjs';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { ThreatAgentInterest } from '../model/threat-agent-interest.model';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';

interface Formula {
  element: string;
  value: string;
  warning: boolean;
}

@Component({
  selector: 'jhi-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.css'],
})
export class RiskDetailsComponent implements OnInit, OnDestroy {
  public assetError = false;
  public formulaTable: Formula[] = [];
  public formulaSum: string;
  public loading = false;
  public loadingFormulaTable = false;
  public loadingRiskLevel = false;
  public attacksToolTipLoaded = false;
  public attacksToolTipLoadedTimer = false;
  public criticalLevel: CriticalLevelMgm;
  public bostonSquareCells: string[][] = [];
  public squareColumnElement: number[];
  public squareRowElement: number[];
  public lastSquareRowElement: number;
  public impactTable: AttackCostFormula[];
  public selectedAsset: MyAssetMgm;
  public threatAgentInterest: ThreatAgentInterest[] = [];
  public directImpactTable: AttackCostFormula[] = [];
  public indirectImpactTable: AttackCostFormula[] = [];
  public selectedImpact: AttackCostFormula;
  public impactFormula: string;
  public attacksToolTip: Map<number, string> = new Map<number, string>();
  public attackChances: MyAssetAttackChance[];

  private criticalLevelSubscription: Subscription;
  private impactLevelSubscription: Subscription;
  private mySelf: SelfAssessmentMgm;

  constructor(
    private riskService: RiskManagementService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private route: ActivatedRoute,
    private myAssetService: MyAssetMgmService,
    private impactEvaluationService: ImpactEvaluationService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.route.params.subscribe(
      (params: Params) => {
        const assetId = params['assetId'];
        this.myAssetService.find(assetId).toPromise().then((asset) => {
          if (asset.body) {
            this.selectedAsset = asset.body;
            this.getImpactFormula(this.selectedAsset);
            this.getImpactInfo(this.selectedAsset);
            this.riskService.getAttackChance(this.selectedAsset, this.mySelf).toPromise().then((res) => {
              if (res) {
                this.attackChances = res;
              }
            });
            this.riskService.getThreatAgentsInterests(this.selectedAsset, this.mySelf).toPromise().then((res) => {
              if (res) {
                this.threatAgentInterest = res;
              }
            });
          } else {
            this.assetError = true;
          }
          this.loading = false;
          this.assetError = false;
        });
      });
    this.impactLevelSubscription = this.impactEvaluationService.subscribeForImpactLevel().subscribe((res) => {
      if (res) {
        this.ngOnInit();
      }
    });
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

  ngOnDestroy() {
    this.criticalLevelSubscription.unsubscribe();
    this.impactLevelSubscription.unsubscribe();
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
    this.loadingFormulaTable = true;
    this.riskService.getImpactFormulaByMyAsset(this.mySelf, myAsset).toPromise().then((res) => {
      if (res) {
        this.impactFormula = res.toString();
        this.evaluateFormulaTable(this.impactFormula);
        this.loadingFormulaTable = false;
      } else {
        this.impactFormula = undefined;
        this.loadingFormulaTable = false;
      }
    }).catch(() => {
      this.impactFormula = undefined;
      this.loadingFormulaTable = false;
    });
  }

  private evaluateFormulaTable(formula: string) {
    this.formulaTable = [];
    this.formulaSum = formula.substr(formula.indexOf('=') + 1);
    formula = formula.substr(0, formula.indexOf('='));
    const elements = formula.split('+');
    elements.forEach((param) => {
      param = param.trim();
      const f: Formula = {
        element: param.substr(0, param.indexOf('(')).replace(new RegExp('\\.', 'g'), ' ').replace(new RegExp('_', 'g'), ' ').replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }),
        value: param.substr(param.indexOf('(') + 1).replace(')', ''),
        warning: param.substr(param.indexOf('(') + 1).replace(')', '') === '0.00€' ? true : false
      };
      this.formulaTable.push(f);
    });
  }

  private getImpactInfo(myAsset: MyAssetMgm) {
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
      }
    });
  }

  public whichContentByCell(row: number, column: number, myAsset: MyAssetMgm): string {
    if (!this.attackChances) {
      return '';
    }
    if (this.bostonSquareCells.length >= row) {
      if (this.bostonSquareCells[row - 1] && this.bostonSquareCells[row - 1].length >= column) {
        return this.bostonSquareCells[row - 1][column - 1];
      }
    }
    const level = row * column;
    let content = '';
    let fullContent = '';
    let attackCounter = 0;
    for (const attack of this.attackChances) {
      const critical = Math.round(attack.likelihood) * Math.round(attack.vulnerability);
      if (level === critical && Math.round(attack.likelihood) === row && column === Math.round(attack.vulnerability)) {
        if (content.length === 0) {
          content = attack.attackStrategy.name;
        } else {
          attackCounter++;
        }
        fullContent = fullContent.concat(attack.attackStrategy.name + ', ');
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

  public whichLevel(row: number, column: number): string {
    return this.riskService.whichLevel(row, column, this.criticalLevel);
  }

  public previousState() {
    window.history.back();
  }

}
