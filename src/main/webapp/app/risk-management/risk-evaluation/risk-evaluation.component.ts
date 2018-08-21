import { Component, OnInit } from '@angular/core';
import { RiskManagementService } from '../risk-management.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../../entities/critical-level-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';

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

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private riskService: RiskManagementService
  ) { }

  ngOnInit() {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.riskService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        this.myAssets = res;
        console.log(this.myAssets);
      }
    });
    this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
      if (res) {
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
      }
    });
  }

  public whichLevel(row: number, column: number): string {
    return this.riskService.whichLevel(row, column, this.criticalLevel);
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
