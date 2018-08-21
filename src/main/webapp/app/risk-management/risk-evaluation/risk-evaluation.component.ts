import { Component, OnInit } from '@angular/core';
import { RiskManagementService } from '../risk-management.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../../entities/critical-level-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { MyAssetAttackChance } from '../model/my-asset-attack-chance.model';
import { AttackStrategyMgm } from '../../entities/attack-strategy-mgm';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'risk-evaluation',
  templateUrl: './risk-evaluation.component.html',
  styleUrls: ['./risk-evaluation.component.css'],
})
export class RiskEvaluationComponent implements OnInit {
  private mySelf: SelfAssessmentMgm;
  private myAssets: MyAssetMgm[];
  public criticalLevel: CriticalLevelMgm;
  public squareColumnElement: number[];
  public squareRowElement: number[];
  public lastSquareRowElement: number;
  public selectedRow: number;
  public selectedColumn: number;
  public mapAssetAttacks: Map<number, MyAssetAttackChance[]> = new Map<number, MyAssetAttackChance[]>();
  public loading = false;
  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private riskService: RiskManagementService
  ) { }

  ngOnInit() {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.riskService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        this.loading = true;
        this.myAssets = res;
        console.log(this.myAssets);
        for (const myAsset of this.myAssets) {
          let intIndex = 0;
          while (intIndex < 15) {
            const attack: MyAssetAttackChance = new MyAssetAttackChance();
            attack.attackStrategy = new AttackStrategyMgm();
            attack.attackStrategy.name = 'ATTACK' + myAsset.asset.name + intIndex;
            attack.critical = Math.floor(Math.random() * this.criticalLevel.side) + 1;
            attack.impact = Math.floor(Math.random() * this.criticalLevel.side) + 1;
            attack.myAsset = myAsset;
            attack.likelihood = Math.floor(Math.random() * this.criticalLevel.side) + 1;
            attack.vulnerability = Math.floor(Math.random() * this.criticalLevel.side) + 1;
            if (this.mapAssetAttacks.has(myAsset.id)) {
              const array = this.mapAssetAttacks.get(myAsset.id);
              array.push(attack);
              this.mapAssetAttacks.set(myAsset.id, array);
            } else {
              this.mapAssetAttacks.set(myAsset.id, [attack]);
            }
            intIndex++;
          }
        }
        // TODO codice da decommentare quando rientra la issue relativa al WP4
        /*
        for (const myAsset of this.myAssets) {
          this.riskService.getAttackChance(myAsset, this.mySelf).toPromise().then((res2) => {
            if (res2) {
              this.mapAssetAttacks.set(myAsset.id, res2);
            }
          });
        }
        */
        console.log(this.mapAssetAttacks);
        this.loading = false;
      }
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

  public whichLevel(row: number, column: number): string {
    return this.riskService.whichLevel(row, column, this.criticalLevel);
  }

  public loadContent(row: number, column: number, myAsset: MyAssetMgm, type: string): string {
    console.log(row);
    console.log(column);
    console.log(myAsset.asset.name);
    console.log(type);
    return '';
  }

  public whichContentByCell(row: number, column: number, myAsset: MyAssetMgm, type: string): string {
    const attacks = this.mapAssetAttacks.get(myAsset.id);
    const level = row * column;
    let content = '';
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
