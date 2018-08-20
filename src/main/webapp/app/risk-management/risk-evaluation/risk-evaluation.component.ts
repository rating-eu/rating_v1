import { Component, OnInit } from '@angular/core';
import { RiskManagementService } from '../risk-management.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../../entities/critical-level-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'risk-evaluation',
  templateUrl: './risk-evaluation.component.html',
  styles: []
})
export class RiskEvaluationComponent implements OnInit {
  private mySelf: SelfAssessmentMgm;
  private myAssets: MyAssetMgm[];
  public criticalLevel: CriticalLevelMgm;

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
      }
    });
  }

}
