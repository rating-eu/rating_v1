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
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import { MyCategoryType } from '../../entities/enumerations/MyCategoryType.enum';
import { MySectorType } from '../../entities/enumerations/MySectorType.enum';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { ImpactEvaluationStatus } from '../../impact-evaluation/model/impact-evaluation-status.model';

interface OrderBy {
  category: boolean;
  value: boolean;
  type: string;
}

@Component({
  selector: 'jhi-losses-widget',
  templateUrl: './losses-widget.component.html',
  styleUrls: ['losses-widget.component.css']
})
export class LossesWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = true;
  public companySector: string;
  public lossesPercentage: number;
  public tableInfo: {
    splitting: string,
    value: number,
    type: string
  }[];
  public orderBy: OrderBy;
  public selectedCategory: string;
  public assetsBySelectedCategory: MyAssetMgm[] = [];

  private myAssets: MyAssetMgm[] = [];
  private wp3Status: ImpactEvaluationStatus;
  private mySelf: SelfAssessmentMgm;

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.orderBy = {
      category: false,
      value: false,
      type: 'desc'
    };
    this.impactService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        this.myAssets = res;
      }
    });
    this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
      if (status) {
        this.wp3Status = status;
        this.tableInfo = [];
        this.lossesPercentage = this.wp3Status.economicCoefficients.lossOfIntangible ? this.wp3Status.economicCoefficients.lossOfIntangible / 100 : undefined;
        for (const impact of this.wp3Status.splittingLosses) {
          if (!this.companySector && impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
            this.companySector = impact.sectorType.toString().charAt(0).toUpperCase() + impact.sectorType.toString().slice(1).toLowerCase();
          } else {
            this.companySector = 'Global';
          }
          switch (impact.categoryType.toString()) {
            case MyCategoryType.IP.toString(): {
              this.tableInfo.push({
                splitting: 'Intellectual Properties',
                value: Math.round(impact.loss * 100) / 100,
                type: 'IP'
              });
              break;
            }
            case MyCategoryType.KEY_COMP.toString(): {
              this.tableInfo.push({
                splitting: 'Key Competences',
                value: Math.round(impact.loss * 100) / 100,
                type: 'KEY_COMP'
              });
              break;
            }
            case MyCategoryType.ORG_CAPITAL.toString(): {
              this.tableInfo.push({
                splitting: 'Organizational Capital (Reputation & Brand included )',
                value: Math.round(impact.loss * 100) / 100,
                type: 'ORG_CAPITAL'
              });
              break;
            }
            case MyCategoryType.DATA.toString(): {
              this.tableInfo.push({
                splitting: 'Data',
                value: Math.round(impact.loss * 100) / 100,
                type: 'DATA'
              });
              break;
            }
          }
          this.tableInfo = _.orderBy(this.tableInfo, ['value'], ['desc']);
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }).catch(() => {
      this.loading = false;
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
      case 'ORG_CAPITAL': {
        for (const asset of this.myAssets) {
          if (asset.asset.assetcategory.name === 'Organisational capital' ||
            asset.asset.assetcategory.name === 'Reputation' ||
            asset.asset.assetcategory.name === 'Brand') {
            this.assetsBySelectedCategory.push(asset);
          }
        }
        break;
      }
      case 'KEY_COMP': {
        for (const asset of this.myAssets) {
          if (asset.asset.assetcategory.name === 'Key competences and human capital') {
            this.assetsBySelectedCategory.push(asset);
          }
        }
        break;
      }
      case 'IP': {
        for (const asset of this.myAssets) {
          if (asset.asset.assetcategory.name === 'Intellectual Property (IPR)' ||
            asset.asset.assetcategory.name === 'Innovation') {
            this.assetsBySelectedCategory.push(asset);
          }
        }
        break;
      }
      case 'DATA': {
        for (const asset of this.myAssets) {
          if (asset.asset.assetcategory.name === 'Data') {
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
