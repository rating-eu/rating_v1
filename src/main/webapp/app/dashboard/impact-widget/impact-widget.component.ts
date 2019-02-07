import { ImpactEvaluationStatus } from './../../impact-evaluation/model/impact-evaluation-status.model';
import { DashboardStepEnum } from './../models/enumeration/dashboard-step.enum';
import { DashboardService, DashboardStatus } from './../dashboard.service';
import { ImpactEvaluationService } from './../../impact-evaluation/impact-evaluation.service';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { Status } from '../../entities/enumerations/QuestionnaireStatus.enum';

@Component({
  selector: 'jhi-impact-widget',
  templateUrl: './impact-widget.component.html',
  styleUrls: ['impact-widget.component.css']
})
export class ImpactWidgetComponent implements OnInit {
  public loading = false;
  private mySelf: SelfAssessmentMgm;
  private status: DashboardStatus;
  private dashboardStatus = DashboardStepEnum;

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private dashService: DashboardService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.status = this.dashService.getStatus();

    this.dashService.getStatusFromServer(this.mySelf, this.dashboardStatus.ATTACK_RELATED_COSTS).toPromise().then((res) => {
      this.status.impactEvaluationStatus = Status[res];
      this.dashService.updateStepStatus(DashboardStepEnum.ATTACK_RELATED_COSTS, this.status.attackRelatedCostEstimationStatus);
    });
  }

}
