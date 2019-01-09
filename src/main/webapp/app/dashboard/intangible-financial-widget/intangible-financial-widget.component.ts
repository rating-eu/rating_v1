import * as _ from 'lodash';
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import { IdentifyAssetUtilService } from './../../identify-assets/identify-asset.util.service';
import { Component, OnInit } from '@angular/core';
import { AssetType } from '../../entities/enumerations/AssetType.enum';

@Component({
  selector: 'jhi-intangible-financial-widget',
  templateUrl: './intangible-financial-widget.component.html',
  styleUrls: ['intangible-financial-widget.component.css']
})
export class IntangibleFinancialWidgetComponent implements OnInit {
  private mySelf: SelfAssessmentMgm = {};

  public intangible: MyAssetMgm[];
  public loading = false;
  public isCollapsed = true;
  public assetsPaginator = {
    id: 'asset_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private idaUtilsService: IdentifyAssetUtilService
  ) { }

  ngOnInit() {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.idaUtilsService.getMySavedAssets(this.mySelf)
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
