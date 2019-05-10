/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { AssetMgm } from './../../entities/asset-mgm/asset-mgm.model';
import { DashboardStepEnum } from '../models/enumeration/dashboard-step.enum';
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import { ImpactEvaluationStatus } from '../../impact-evaluation/model/impact-evaluation-status.model';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { RiskBoardService, DashboardStatus } from '../risk-board.service';
import { AssetType } from '../../entities/enumerations/AssetType.enum';
import { Status } from '../../entities/enumerations/QuestionnaireStatus.enum';
import {DatasharingService} from "../../datasharing/datasharing.service";

interface OrderBy {
  category: boolean;
  value: boolean;
  type: string;
}

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
  public orderBy: OrderBy;
  public selectedCategory: string;
  public assetsBySelectedCategory: MyAssetMgm[] = [];
  public priorities = ['Low', 'Low medium', 'Medium', 'Medium high', 'High'];

  private mySelf: SelfAssessmentMgm;
  private wp3Status: ImpactEvaluationStatus;
  private status: DashboardStatus;
  private dashboardStatus = DashboardStepEnum;

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private dashService: RiskBoardService,
    private dataSharingService: DatasharingService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.dataSharingService.selfAssessment;
    this.status = this.dashService.getDashboardStatus();
    this.tableInfo = [];
    this.orderBy = {
      category: false,
      value: false,
      type: 'desc'
    };
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
      this.status.impactEvaluationStatus = Status[res];
      this.dashService.updateStepStatus(DashboardStepEnum.IMPACT_EVALUATION, this.status.impactEvaluationStatus);
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

  private resetOrder() {
    this.orderBy.category = false;
    this.orderBy.value = false;
    this.orderBy.type = 'desc';
  }

  public tableOrderBy(orderColumn: string, desc: boolean) {
    this.resetOrder();
    if (desc) {
      this.orderBy.type = 'desc';
    } else {
      this.orderBy.type = 'asc';
    }
    switch (orderColumn.toLowerCase()) {
      case ('category'): {
        this.orderBy.category = true;
        if (desc) {
          this.tableInfo = _.orderBy(this.tableInfo, ['splitting'], ['desc']);
        } else {
          this.tableInfo = _.orderBy(this.tableInfo, ['splitting'], ['asc']);
        }
        break;
      }
      case ('value'): {
        this.orderBy.value = true;
        if (desc) {
          this.tableInfo = _.orderBy(this.tableInfo, ['value'], ['desc']);
        } else {
          this.tableInfo = _.orderBy(this.tableInfo, ['value'], ['asc']);
        }
        break;
      }
    }
  }
}
