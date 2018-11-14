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
  public selectedAsset: MyAssetMgm;
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
      // this.ref.detectChanges();
    }).catch(() => {
      // this.ref.detectChanges();
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

  public updateMyAsset() {
    console.log(this.selectedAsset);
    this.idaUtilsService.updateAsset(this.selectedAsset);
  }

}
