import * as _ from 'lodash';
import { DashboardStepEnum } from './../models/enumeration/dashboard-step.enum';
import { DashboardService, DashboardStatus } from './../dashboard.service';
import { ImpactEvaluationService } from './../../impact-evaluation/impact-evaluation.service';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { Status } from '../../entities/enumerations/QuestionnaireStatus.enum';
import { MyAssetMgm } from '../../entities/my-asset-mgm';

interface WidgetItem {
  impact: number;
  economicValueMin: number;
  economicValueMax: number;
  assets: MyAssetMgm[];
}

@Component({
  selector: 'jhi-impact-widget',
  templateUrl: './impact-widget.component.html',
  styleUrls: ['impact-widget.component.css']
})
export class ImpactWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = true;
  public widgetElements: WidgetItem[] = [];
  public selectedImpact: number;

  private mySelf: SelfAssessmentMgm;
  private status: DashboardStatus;
  private dashboardStatus = DashboardStepEnum;
  private myAssets: MyAssetMgm[] = [];

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

    this.impactService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        this.myAssets = res;
        this.myAssets.forEach((value) => {
          if (this.widgetElements.length === 0) {
            const element = {
              impact: value.impact,
              economicValueMin: value.economicImpact,
              economicValueMax: value.economicImpact,
              assets: [value]
            };
            this.widgetElements.push(_.cloneDeep(element));
          } else {
            const index = _.findIndex(this.widgetElements, { impact: value.impact });
            if (index !== -1) {
              this.widgetElements[index].economicValueMin = this.widgetElements[index].economicValueMin < value.economicImpact ?
                this.widgetElements[index].economicValueMin : value.economicImpact;
              this.widgetElements[index].economicValueMax = this.widgetElements[index].economicValueMax > value.economicImpact ?
                this.widgetElements[index].economicValueMax : value.economicImpact;
              this.widgetElements[index].assets.push(_.cloneDeep(value));
            } else {
              const element = {
                impact: value.impact,
                economicValueMin: value.economicImpact,
                economicValueMax: value.economicImpact,
                assets: [value]
              };
              this.widgetElements.push(_.cloneDeep(element));
            }
          }
        });
        this.loading = false;
      }
    });
  }

  public setImpact(impact: number) {
    if (this.selectedImpact === null) {
      this.selectedImpact = impact;
    } else {
      if (this.selectedImpact === impact) {
        this.selectedImpact = null;
      } else {
        this.selectedImpact = impact;
      }
    }
  }

}
