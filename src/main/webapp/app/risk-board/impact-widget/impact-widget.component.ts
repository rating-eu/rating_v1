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

import * as _ from 'lodash';
import { DashboardStepEnum } from './../models/enumeration/dashboard-step.enum';
import { RiskBoardService, DashboardStatus } from '../risk-board.service';
import { ImpactEvaluationService } from './../../impact-evaluation/impact-evaluation.service';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { Status } from '../../entities/enumerations/QuestionnaireStatus.enum';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import {DatasharingService} from "../../datasharing/datasharing.service";

interface OrderBy {
  impact: boolean;
  from: boolean;
  to: boolean;
  type: string;
}

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
  public orderBy: OrderBy;

  private mySelf: SelfAssessmentMgm;
  private status: DashboardStatus;
  private dashboardStatus = DashboardStepEnum;
  private myAssets: MyAssetMgm[] = [];

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private dashService: RiskBoardService,
    private dataSharingService: DatasharingService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.dataSharingService.selfAssessment;
    this.orderBy = {
      impact: false,
      from: false,
      to: false,
      type: 'desc'
    };
    this.status = this.dashService.getDashboardStatus();
    this.dashService.getStatusFromServer(this.mySelf, this.dashboardStatus.ATTACK_RELATED_COSTS).toPromise().then((res) => {
      this.status.attackRelatedCostEstimationStatus = Status[res];
      this.dashService.updateStepStatus(DashboardStepEnum.ATTACK_RELATED_COSTS, this.status.attackRelatedCostEstimationStatus);
    });

    this.impactService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        this.myAssets = res;
        this.myAssets.forEach((value, counter, array) => {
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
              this.widgetElements[index].assets = _.orderBy(this.widgetElements[index].assets, ['economicImpact'], ['desc']);
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
          if (counter === array.length - 1) {
            for (let i = 1; i <= 5; i++) {
              const iIndex = _.findIndex(this.widgetElements, { impact: i });
              if (iIndex === -1) {
                const emptyElement = {
                  impact: i,
                  economicValueMin: undefined,
                  economicValueMax: undefined,
                  assets: []
                };
                this.widgetElements.push(_.cloneDeep(emptyElement));
              }
            }
            this.widgetElements = _.orderBy(this.widgetElements, ['impact'], ['desc']);
          }
        });
        this.loading = false;
      } else {
        this.loading = false;
      }
    }).catch(() => {
      this.loading = false;
    });
  }

  private resetOrder() {
    this.orderBy.from = false;
    this.orderBy.to = false;
    this.orderBy.impact = false;
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
      case ('impact'): {
        this.orderBy.impact = true;
        if (desc) {
          this.widgetElements = _.orderBy(this.widgetElements, ['impact'], ['desc']);
        } else {
          this.widgetElements = _.orderBy(this.widgetElements, ['impact'], ['asc']);
        }
        break;
      }
      case ('from'): {
        this.orderBy.from = true;
        if (desc) {
          this.widgetElements = _.orderBy(this.widgetElements, ['economicValueMin'], ['desc']);
        } else {
          this.widgetElements = _.orderBy(this.widgetElements, ['economicValueMin'], ['asc']);
        }
        break;
      }
      case ('to'): {
        this.orderBy.to = true;
        if (desc) {
          this.widgetElements = _.orderBy(this.widgetElements, ['economicValueMax'], ['desc']);
        } else {
          this.widgetElements = _.orderBy(this.widgetElements, ['economicValueMax'], ['asc']);
        }
        break;
      }
    }
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
