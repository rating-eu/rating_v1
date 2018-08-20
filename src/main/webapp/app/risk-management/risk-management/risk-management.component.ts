import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { RiskManagementService } from '../risk-management.service';
import { CriticalLevelMgm, CriticalLevelMgmService } from '../../entities/critical-level-mgm';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.css'],
})
export class RiskManagementComponent implements OnInit {
  public isLikelihoodCollapsed = true;
  public isVulnerabilityCollapsed = true;
  public isCriticalCollapsed = true;
  public isLevelsCollapsed = true;
  public selectedRow: number;
  public selectedColumn: number;
  public squareColumnElement: number[];
  public squareRowElement: number[];
  private mySelf: SelfAssessmentMgm;
  private criticalLevel: CriticalLevelMgm;

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private criticalLevelService: CriticalLevelMgmService,
    private riskService: RiskManagementService
  ) { }

  ngOnInit() {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    /*
    this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
      if (res) {
        this.criticalLevel = res;
      }
    });
    */
    this.criticalLevel = new CriticalLevelMgm();
    this.criticalLevel.side = 5;
    this.criticalLevel.lowLimit = 4;
    this.criticalLevel.mediumLimit = 14;
    this.criticalLevel.highLimit = 25;

    this.squareColumnElement = [];
    this.squareRowElement = [];
    for (let i = 1; i <= this.criticalLevel.side; i++) {
      this.squareColumnElement.push(i);
    }
    for (let i = 1; i <= this.criticalLevel.side + 1; i++) {
      this.squareRowElement.push(i);
    }
  }

  public switchOnCollapsible(collapsible: string) {
    switch (collapsible) {
      case 'likelihood': {
        this.isVulnerabilityCollapsed = true;
        this.isCriticalCollapsed = true;
        this.isLevelsCollapsed = true;
        this.isLikelihoodCollapsed = false;
        break;
      }
      case 'vulnerability': {
        this.isVulnerabilityCollapsed = false;
        this.isCriticalCollapsed = true;
        this.isLevelsCollapsed = true;
        this.isLikelihoodCollapsed = true;
        break;
      }
      case 'critical-level': {
        this.isVulnerabilityCollapsed = true;
        this.isCriticalCollapsed = false;
        this.isLevelsCollapsed = true;
        this.isLikelihoodCollapsed = true;
        break;
      }
      case 'none': {
        this.isVulnerabilityCollapsed = true;
        this.isCriticalCollapsed = true;
        this.isLevelsCollapsed = true;
        this.isLikelihoodCollapsed = true;
        break;
      }
    }
  }

  public criticalLevelUpdate(level: string) {
    console.log(this.selectedRow);
    console.log(this.selectedColumn);
    console.log(level);
    // update critical level call
    /*
    this.riskService.updateCriticalLevel(this).toPromise().then((res) => {
      if (res) {
        this.criticalLevel = res;
      }
    });
    */
  }

  public whichLevel(row: number, column: number): string {
    const level = row * column;
    if (level <= this.criticalLevel.lowLimit) {
      return 'low';
    } else if (level > this.criticalLevel.lowLimit && level <= this.criticalLevel.mediumLimit) {
      return 'medium';
    } else if (level > this.criticalLevel.mediumLimit && level <= this.criticalLevel.highLimit) {
      return 'high';
    } else {
      return 'undefined';
    }
  }

  public selectedMatrixCell(row: number, column: number) {
    if (this.selectedColumn === column && this.selectedRow === row) {
      this.selectedColumn = undefined;
      this.selectedRow = undefined;
      this.isLevelsCollapsed = true;
    } else {
      this.selectedRow = row;
      this.selectedColumn = column;
      this.isLevelsCollapsed = false;
    }
  }

  public closeLevelSelection() {
    this.selectedColumn = undefined;
    this.selectedRow = undefined;
    this.isLevelsCollapsed = true;
  }

}
