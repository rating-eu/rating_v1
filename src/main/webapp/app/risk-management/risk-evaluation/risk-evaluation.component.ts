import { Component, OnInit } from '@angular/core';
import { RiskManagementService } from '../risk-management.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../../entities/critical-level-mgm';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'risk-evaluation',
  templateUrl: './risk-evaluation.component.html',
  styles: []
})
export class RiskEvaluationComponent implements OnInit {
  private mySelf: SelfAssessmentMgm;
  public criticalLevel: CriticalLevelMgm;

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private riskService: RiskManagementService
  ) { }

  ngOnInit() {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
      if (res) {
        this.criticalLevel = res;
      }
    });
  }

}
