import { AssetMgm } from './../../entities/asset-mgm/asset-mgm.model';
import { DashboardStepEnum } from '../models/enumeration/dashboard-step.enum';
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import { ImpactEvaluationStatus } from '../../impact-evaluation/model/impact-evaluation-status.model';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { DashboardService, DashboardStatus } from '../dashboard.service';
import { AssetType } from '../../entities/enumerations/AssetType.enum';

@Component({
  selector: 'jhi-tangible-financial-widget',
  templateUrl: './tangible-financial-widget.component.html',
  styleUrls: ['tangible-financial-widget.component.css']
})
export class TangibleFinancialWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = true;
  public assets: MyAssetMgm[];
  public tableInfo: {
    splitting: string,
    value: number,
    type: string
  }[];
  public selectedCategory: string;
  public assetsBySelectedCategory: MyAssetMgm[] = [];

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
    this.tableInfo = [];
    this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
      if (status) {
        this.wp3Status = status;
        this.assets = this.wp3Status.myTangibleAssets;
        this.assets = _.orderBy(this.assets, ['economicValue'], ['desc']);
        let currentCategoryValue = 0;
        let fixedCategoryValue = 0;
        for (const asset of this.assets) {
          if ((asset.asset as AssetMgm).assetcategory.type.toString() === AssetType.TANGIBLE.toString()) {
            if ((asset.asset as AssetMgm).assetcategory.name === 'Current Assets') {
              currentCategoryValue += asset.economicValue;
            } else if ((asset.asset as AssetMgm).assetcategory.name === 'Fixed Assets') {
              fixedCategoryValue += asset.economicValue;
            }
          }
        }
        this.tableInfo.push(
          {
            splitting: 'Current Assets',
            value: currentCategoryValue,
            type: 'CURRENT'
          },
          {
            splitting: 'Fixed Assets',
            value: fixedCategoryValue,
            type: 'FIXED'
          }
        );
        this.tableInfo = _.orderBy(this.tableInfo, ['value'], ['desc']);
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

  public setAssetCategory(category: string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = undefined;
    } else {
      this.selectedCategory = category;
    }
    this.assetsBySelectedCategory = [];
    switch (category) {
      case 'CURRENT': {
        for (const asset of this.assets) {
          if (asset.asset.assetcategory.name === 'Current Assets') {
            this.assetsBySelectedCategory.push(asset);
          }
        }
        break;
      }
      case 'FIXED': {
        for (const asset of this.assets) {
          if (asset.asset.assetcategory.name === 'Fixed Assets') {
            this.assetsBySelectedCategory.push(asset);
          }
        }
        break;
      }
    }
  }
}
