import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { RiskManagementService } from '../risk-management.service';
import { CriticalLevelMgm, CriticalLevelMgmService } from '../../entities/critical-level-mgm';
import { JhiAlertService } from '../../../../../../node_modules/ng-jhipster';

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
  public isConsequenceCollapsed = true;
  public selectedRow: number;
  public selectedColumn: number;
  public squareColumnElement: number[];
  public squareRowElement: number[];
  public lastSquareRowElement: number;
  private mySelf: SelfAssessmentMgm;
  public criticalLevel: CriticalLevelMgm;
  public impactMinLevelValues: number[] = [];
  public impactMaxLevelValues: number[] = [];

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private criticalLevelService: CriticalLevelMgmService,
    private riskService: RiskManagementService,
    private jhiAlertService: JhiAlertService
  ) { }

  ngOnInit() {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    // TODO Chiamata per il recupero degli impact level
    for (let i = 0; i < 5; i++) {
      this.impactMinLevelValues[i] = Math.random();
      this.impactMaxLevelValues[i] = Math.random();
    }
    this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
      if (res) {
        this.criticalLevel = res;
      } else {
        this.criticalLevel = new CriticalLevelMgm();
        this.criticalLevel.side = 5;
        this.criticalLevel.lowLimit = 4;
        this.criticalLevel.mediumLimit = 14;
        this.criticalLevel.highLimit = 25;
        this.criticalLevel.selfAssessment = this.mySelf;
        this.criticalLevelService.create(this.criticalLevel).toPromise().then((res2) => {
          if (res2) {
            this.criticalLevel = res2.body;
          }
        });
      }
      this.squareColumnElement = [];
      this.squareRowElement = [];
      this.lastSquareRowElement = this.criticalLevel.side + 1;
      for (let i = 1; i <= this.criticalLevel.side; i++) {
        this.squareColumnElement.push(i);
      }
      for (let i = 1; i <= this.criticalLevel.side + 1; i++) {
        this.squareRowElement.push(i);
      }
    });
  }

  public switchOnCollapsible(collapsible: string) {
    switch (collapsible) {
      case 'consequence': {
        this.isVulnerabilityCollapsed = true;
        this.isCriticalCollapsed = true;
        this.isLevelsCollapsed = true;
        this.isLikelihoodCollapsed = true;
        this.isConsequenceCollapsed = false;
        break;
      }
      case 'likelihood': {
        this.isVulnerabilityCollapsed = true;
        this.isCriticalCollapsed = true;
        this.isLevelsCollapsed = true;
        this.isLikelihoodCollapsed = false;
        this.isConsequenceCollapsed = true;
        break;
      }
      case 'vulnerability': {
        this.isVulnerabilityCollapsed = false;
        this.isCriticalCollapsed = true;
        this.isLevelsCollapsed = true;
        this.isLikelihoodCollapsed = true;
        this.isConsequenceCollapsed = true;
        break;
      }
      case 'critical-level': {
        this.isVulnerabilityCollapsed = true;
        this.isCriticalCollapsed = false;
        this.isLevelsCollapsed = true;
        this.isLikelihoodCollapsed = true;
        this.isConsequenceCollapsed = true;
        break;
      }
      case 'none': {
        this.isVulnerabilityCollapsed = true;
        this.isCriticalCollapsed = true;
        this.isLevelsCollapsed = true;
        this.isLikelihoodCollapsed = true;
        this.isConsequenceCollapsed = true;
        break;
      }
    }
  }

  public impactLevelUpdate(level: number, valueMin: number, valueMax: number) {
    console.log(level);
    console.log(valueMin);
    console.log(valueMax);
    console.log(this.impactMinLevelValues);
    console.log(this.impactMaxLevelValues);
  }

  public criticalLevelUpdate(level: string) {
    console.log(this.selectedRow);
    console.log(this.selectedColumn);
    console.log(level);
    const newLimit = this.selectedRow * this.selectedColumn;
    // setto il nuovo limite
    switch (level) {
      case 'low': {
        const oldLowLimit = this.criticalLevel.lowLimit;
        this.criticalLevel.lowLimit = newLimit;
        if (this.criticalLevel.lowLimit >= this.criticalLevel.mediumLimit) {
          this.criticalLevel.mediumLimit = undefined;
        } else {
          if (!this.criticalLevel.mediumLimit && !this.criticalLevel.highLimit) {
            this.criticalLevel.mediumLimit = this.criticalLevel.side * this.criticalLevel.side;
          } else if (!this.criticalLevel.mediumLimit && (this.criticalLevel.highLimit !== undefined || this.criticalLevel.highLimit !== null)) {
            this.criticalLevel.mediumLimit = oldLowLimit;
          }
        }
        if (this.criticalLevel.lowLimit === this.criticalLevel.side * this.criticalLevel.side) {
          this.criticalLevel.highLimit = undefined;
        }
        break;
      }
      case 'medium': {
        this.criticalLevel.mediumLimit = newLimit;
        if (this.criticalLevel.mediumLimit === 1) {
          this.criticalLevel.lowLimit = undefined;
          if (!this.criticalLevel.highLimit) {
            this.criticalLevel.mediumLimit = this.criticalLevel.side * this.criticalLevel.side;
          }
        } else {
          if (this.criticalLevel.mediumLimit <= this.criticalLevel.lowLimit && this.criticalLevel.mediumLimit !== 1) {
            this.criticalLevel.lowLimit = this.criticalLevel.mediumLimit - 1;
          }
          if (!this.criticalLevel.highLimit) {
            this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
          } else if (this.criticalLevel.mediumLimit === this.criticalLevel.side * this.criticalLevel.side) {
            this.criticalLevel.highLimit = undefined;
          }
        }
        break;
      }
      case 'high': {
        this.criticalLevel.highLimit = newLimit;
        if (this.criticalLevel.highLimit === 1) {
          this.criticalLevel.lowLimit = undefined;
          this.criticalLevel.mediumLimit = undefined;
          this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
        } else {
          if (this.criticalLevel.highLimit <= this.criticalLevel.lowLimit && this.criticalLevel.highLimit !== 1) {
            this.criticalLevel.lowLimit = this.criticalLevel.highLimit - 1;
            this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
          } else if (this.criticalLevel.highLimit < this.criticalLevel.mediumLimit && this.criticalLevel.highLimit > this.criticalLevel.lowLimit) {
            this.criticalLevel.mediumLimit = this.criticalLevel.highLimit - 1;
            this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
          } else if (this.criticalLevel.highLimit < this.criticalLevel.mediumLimit) {
            this.criticalLevel.mediumLimit = this.criticalLevel.highLimit - 1;
            this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
          } else {
            this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
          }
        }
        break;
      }
    }
    console.log(this.criticalLevel.lowLimit);
    console.log(this.criticalLevel.mediumLimit);
    console.log(this.criticalLevel.highLimit);
    this.criticalLevelService.update(this.criticalLevel).toPromise().then((res) => {
      if (res) {
        this.criticalLevel = res.body;
        this.jhiAlertService.success('hermeneutApp.messages.saved', null, null);
      }
    });
  }

  public whichLevel(row: number, column: number): string {
    const level = row * column;
    if (level <= this.criticalLevel.lowLimit) {
      return 'low';
    } else if (level > this.criticalLevel.lowLimit && level <= this.criticalLevel.mediumLimit) {
      return 'medium';
    } else if (level > this.criticalLevel.mediumLimit && level <= this.criticalLevel.highLimit) {
      return 'high';
    } else if (this.criticalLevel.mediumLimit === undefined && level <= this.criticalLevel.highLimit) {
      return 'high';
    } else if (this.criticalLevel.lowLimit === undefined && level <= this.criticalLevel.mediumLimit) {
      return 'medium';
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
