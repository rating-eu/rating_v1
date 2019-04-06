import { ImpactEvaluationStatus } from './../../impact-evaluation/model/impact-evaluation-status.model';
import { ImpactEvaluationService } from './../../impact-evaluation/impact-evaluation.service';
import * as _ from 'lodash';
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import { IdentifyAssetUtilService } from './../../identify-assets/identify-asset.util.service';
import { Component, OnInit } from '@angular/core';
import { AssetType } from '../../entities/enumerations/AssetType.enum';
import { MyCategoryType } from '../../entities/enumerations/MyCategoryType.enum';
import { MySectorType } from '../../entities/enumerations/MySectorType.enum';

interface OrderBy {
  category: boolean;
  value: boolean;
  type: string;
}

@Component({
  selector: 'jhi-intangible-financial-widget',
  templateUrl: './intangible-financial-widget.component.html',
  styleUrls: ['intangible-financial-widget.component.css']
})
export class IntangibleFinancialWidgetComponent implements OnInit {
  private mySelf: SelfAssessmentMgm = {};
  private wp3Status: ImpactEvaluationStatus;

  public intangible: MyAssetMgm[];
  public loading = false;
  public isCollapsed = true;
  public companySector: string;
  public tableInfo: {
    splitting: string,
    value: number,
    type: string
  }[];
  public orderBy: OrderBy;
  public selectedCategory: string;
  public assetsBySelectedCategory: MyAssetMgm[] = [];
  public priorities = ['Low', 'Low medium', 'Medium', 'Medium high', 'High'];

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private idaUtilsService: IdentifyAssetUtilService,
    private impactService: ImpactEvaluationService
  ) { }

  ngOnInit() {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.loading = true;
    this.orderBy = {
      category: false,
      value: false,
      type: 'desc'
    };
    this.idaUtilsService.getMyAssets(this.mySelf)
      .toPromise()
      .then((mySavedAssets) => {
        if (mySavedAssets) {
          if (mySavedAssets.length === 0) {
            this.loading = false;
            return;
          }
          this.intangible = [];
          for (const myAsset of mySavedAssets) {
            if (myAsset.asset.assetcategory.type.toString() === AssetType.INTANGIBLE.toString()) {
              this.intangible.push(myAsset);
            }
          }
          this.intangible = _.orderBy(this.intangible, ['economicValue'], ['desc']);
          this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
            if (status) {
              this.wp3Status = status;
              this.tableInfo = [];
              for (const impact of this.wp3Status.splittingValues) {
                if (!this.companySector && impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
                  this.companySector = impact.sectorType.toString().charAt(0).toUpperCase() + impact.sectorType.toString().slice(1).toLowerCase();
                } else {
                  this.companySector = 'Global';
                }
                switch (impact.categoryType.toString()) {
                  case MyCategoryType.IP.toString(): {
                    this.tableInfo.push({
                      splitting: 'Intellectual Properties',
                      value: Math.round(impact.value * 100) / 100,
                      type: 'IP'
                    });
                    break;
                  }
                  case MyCategoryType.KEY_COMP.toString(): {
                    this.tableInfo.push({
                      splitting: 'Key Competences',
                      value: Math.round(impact.value * 100) / 100,
                      type: 'KEY_COMP'
                    });
                    break;
                  }
                  case MyCategoryType.ORG_CAPITAL.toString(): {
                    this.tableInfo.push({
                      splitting: 'Organizational Capital (Reputation & Brand included )',
                      value: Math.round(impact.value * 100) / 100,
                      type: 'ORG_CAPITAL'
                    });
                    break;
                  }
                }
              }
              this.tableInfo = _.orderBy(this.tableInfo, ['value'], ['desc']);
              this.loading = false;
            } else {
              this.loading = false;
            }
          }).catch(() => {
            this.loading = false;
          });
          this.loading = false;
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
        for (const asset of this.intangible) {
          if (asset.asset.assetcategory.name === 'Organisational capital' ||
            asset.asset.assetcategory.name === 'Reputation' ||
            asset.asset.assetcategory.name === 'Brand') {
            this.assetsBySelectedCategory.push(asset);
          }
        }
        break;
      }
      case 'KEY_COMP': {
        for (const asset of this.intangible) {
          if (asset.asset.assetcategory.name === 'Key competences and human capital') {
            this.assetsBySelectedCategory.push(asset);
          }
        }
        break;
      }
      case 'IP': {
        for (const asset of this.intangible) {
          if (asset.asset.assetcategory.name === 'Intellectual Property (IPR)' ||
            asset.asset.assetcategory.name === 'Innovation') {
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
