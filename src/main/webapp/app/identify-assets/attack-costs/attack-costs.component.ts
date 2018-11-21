import * as _ from 'lodash';
import { DirectAssetMgm } from './../../entities/direct-asset-mgm/direct-asset-mgm.model';
import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import { IdentifyAssetUtilService } from './../identify-asset.util.service';
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'attack-costs',
  templateUrl: './attack-costs.component.html',
  styleUrls: ['./attack-costs.component.css'],
})

export class AttackCostsComponent implements OnInit {
  private mySelf: SelfAssessmentMgm = {};
  public myAssets: MyAssetMgm[];
  public myDirects: DirectAssetMgm[];
  public selectedAsset: MyAssetMgm;
  public selectedDirect: DirectAssetMgm;
  public isMyAssetUpdated = false;

  constructor(
    private idaUtilsService: IdentifyAssetUtilService,
    private mySelfAssessmentService: SelfAssessmentMgmService
  ) {

  }

  ngOnInit(): void {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.idaUtilsService.getMySavedAssets(this.mySelf).toPromise().then((mySavedAssets) => {
      if (mySavedAssets) {
        this.myAssets = mySavedAssets;
      }
    });
    this.idaUtilsService.getMySavedDirectAssets(this.mySelf).toPromise().then((mySavedDirect) => {
      if (mySavedDirect) {
          this.myDirects = mySavedDirect;
      }
  });
  }

  public selectAsset(myAsset: MyAssetMgm) {
    if (myAsset) {
      if (this.selectedAsset) {
        if (this.selectedAsset.id === myAsset.id) {
          this.selectedAsset = null;
        } else {
          this.selectedAsset = myAsset;
        }
      } else {
        this.selectedAsset = myAsset;
      }
    }
  }

  public selectDirect(myDirect: DirectAssetMgm) {
    if (myDirect) {
      if (this.selectedDirect) {
        if (this.selectedDirect.id === myDirect.id) {
          this.selectedDirect = null;
        } else {
          this.selectedDirect = myDirect;
        }
      } else {
        this.selectedDirect = myDirect;
      }
    }
  }

  public updateMyAsset() {
    console.log(this.selectedAsset);
    this.idaUtilsService.updateAsset(this.selectedAsset);
  }

}
