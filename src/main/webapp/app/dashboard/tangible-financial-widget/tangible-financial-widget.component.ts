import { DashboardStepEnum } from '../models/enumeration/dashboard-step.enum';
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import { ImpactEvaluationStatus } from '../../impact-evaluation/model/impact-evaluation-status.model';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { DashboardService, DashboardStatus } from '../dashboard.service';

@Component({
  selector: 'jhi-tangible-financial-widget',
  templateUrl: './tangible-financial-widget.component.html',
  styleUrls: ['tangible-financial-widget.component.css']
})
export class TangibleFinancialWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = true;
  public assets: MyAssetMgm[];
  public assetsPaginator = {
    id: 'tangible_financial_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };

  private mySelf: SelfAssessmentMgm;
  private wp3Status: ImpactEvaluationStatus;
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
    this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
      if (status) {
        this.wp3Status = status;
        this.assets = this.wp3Status.myTangibleAssets;
        this.assets = _.orderBy(this.assets, ['economicValue'], ['desc']);
        this.loading = false;
      } else {
        this.loading = false;
      }
    }).catch(() => {
      this.loading = false;
    });

    this.dashService.getStatusFromServer(this.mySelf, this.dashboardStatus.IMPACT_EVALUATION).toPromise().then((res) => {
      this.status.impactEvaluationStatus = res;
      this.dashService.updateStatus(this.status);
    });
  }

  onAssetsPageChange(number: number) {
    this.assetsPaginator.currentPage = number;
  }

}
