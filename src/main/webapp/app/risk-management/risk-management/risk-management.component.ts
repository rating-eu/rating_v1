import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { RiskManagementService } from '../risk-management.service';

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
  private mySelf: SelfAssessmentMgm;
  private criticalLevel: any;

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private riskService: RiskManagementService
  ) { }

  ngOnInit() {
    // getCriticalLevel(selfId)
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
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
