import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import { ImpactEvaluationStatus } from '../../impact-evaluation/model/impact-evaluation-status.model';
import { MyAssetMgm } from '../../entities/my-asset-mgm';

@Component({
  selector: 'jhi-financial-data-widget',
  templateUrl: './financial-data-widget.component.html',
  styleUrls: ['financial-data-widget.component.css']
})
export class FinancialDataWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = false;
  public assets: MyAssetMgm[] = [];
  public assetsPaginator = {
    id: 'asset_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };

  private mySelf: SelfAssessmentMgm;
  private wp3Status: ImpactEvaluationStatus;

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    // Retrieve the wp3 status from server
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
  }

  onAssetsPageChange(number: number) {
    this.assetsPaginator.currentPage = number;
  }

}
