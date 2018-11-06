import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import { ImpactEvaluationStatus } from '../../impact-evaluation/model/impact-evaluation-status.model';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { DashboardService, DashboardStatus } from '../dashboard.service';

@Component({
  selector: 'jhi-financial-data-widget',
  templateUrl: './financial-data-widget.component.html',
  styleUrls: ['financial-data-widget.component.css']
})
export class FinancialDataWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = true;
  public assets: MyAssetMgm[];
  public assetsPaginator = {
    id: 'asset_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };

  private mySelf: SelfAssessmentMgm;
  private wp3Status: ImpactEvaluationStatus;
  private status: DashboardStatus;

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private dashService: DashboardService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    // impactEvaluationStatus checker
    this.status = this.dashService.getStatus();
    // Retrieve the wp3 status from server
    this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
      if (status) {
        this.wp3Status = status;
        this.assets = this.wp3Status.myTangibleAssets;
        this.assets = _.orderBy(this.assets, ['economicValue'], ['desc']);
        this.loading = false;
        this.status.impactEvaluationStatus = true;
        this.dashService.updateStatus(this.status);
      } else {
        this.loading = false;
        this.status.impactEvaluationStatus = false;
        this.dashService.updateStatus(this.status);
      }
    }).catch(() => {
      this.loading = false;
      this.status.impactEvaluationStatus = false;
      this.dashService.updateStatus(this.status);
    });
  }

  onAssetsPageChange(number: number) {
    this.assetsPaginator.currentPage = number;
  }

}
