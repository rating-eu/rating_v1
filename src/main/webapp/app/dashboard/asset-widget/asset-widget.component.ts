import * as _ from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Principal } from '../../shared';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { IdentifyAssetUtilService } from '../../identify-assets/identify-asset.util.service';
import { MyRole } from '../../entities/enumerations/MyRole.enum';
import { AssetType } from '../../entities/enumerations/AssetType.enum';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-asset-widget',
  templateUrl: './asset-widget.component.html',
  styleUrls: ['asset-widget.component.css']
})
export class AssetWidgetComponent implements OnInit, OnDestroy {
  private mySelf: SelfAssessmentMgm = {};
  private myAssets: MyAssetMgm[];
  private closeResult: string;

  public loading = false;
  public selectedCategory: string;
  public selectedAssetsByCategory: MyAssetMgm[];
  public intangible: MyAssetMgm[];
  public tangible: MyAssetMgm[];
  public intangibleCategoryMap: Map<string, number[]>;
  public tangibleCategoryMap: Map<string, number[]>;
  public tangibleCategoryKeys: string[];
  public intangibleCategoryKeys: string[];
  public intangibleCategoryMapLoaded = false;
  public tangibleCategoryMapLoaded = false;

  private account: Account;
  private eventSubscriber: Subscription;

  constructor(
    private principal: Principal,
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private idaUtilsService: IdentifyAssetUtilService,
    private eventManager: JhiEventManager,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loading = true;
    this.principal.identity().then((account) => {
      this.account = account;
      this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
      this.registerChangeIdentifyAssets();
      if (this.account['authorities'].includes(MyRole.ROLE_CISO) && this.mySelf) {
        this.idaUtilsService.getMySavedAssets(this.mySelf)
          .toPromise()
          .then((mySavedAssets) => {
            if (mySavedAssets) {
              if (mySavedAssets.length === 0) {
                this.loading = false;
                return;
              }
              this.myAssets = mySavedAssets;
              this.tangible = [];
              this.intangible = [];
              this.intangibleCategoryMap = new Map<string, number[]>();
              this.tangibleCategoryMap = new Map<string, number[]>();
              this.tangibleCategoryKeys = [];
              this.intangibleCategoryKeys = [];
              for (const myAsset of this.myAssets) {
                if (myAsset.asset.assetcategory.type.toString() === AssetType.INTANGIBLE.toString()) {
                  this.intangible.push(myAsset);
                  if (this.intangibleCategoryMap.has(myAsset.asset.assetcategory.name)) {
                    const assetsTemp = this.intangibleCategoryMap.get(myAsset.asset.assetcategory.name);
                    assetsTemp.push(myAsset.id);
                    this.intangibleCategoryMap.set(myAsset.asset.assetcategory.name, assetsTemp);
                  } else {
                    this.intangibleCategoryMap.set(myAsset.asset.assetcategory.name, [myAsset.id]);
                    this.intangibleCategoryKeys.push(myAsset.asset.assetcategory.name);
                  }
                } else if (myAsset.asset.assetcategory.type.toString() === AssetType.TANGIBLE.toString()) {
                  this.tangible.push(myAsset);
                  if (this.tangibleCategoryMap.has(myAsset.asset.assetcategory.name)) {
                    const assetsTemp = this.tangibleCategoryMap.get(myAsset.asset.assetcategory.name);
                    assetsTemp.push(myAsset.id);
                    this.tangibleCategoryMap.set(myAsset.asset.assetcategory.name, assetsTemp);
                  } else {
                    this.tangibleCategoryMap.set(myAsset.asset.assetcategory.name, [myAsset.id]);
                    this.tangibleCategoryKeys.push(myAsset.asset.assetcategory.name);
                  }
                }
              }
              this.intangibleCategoryMapLoaded = true;
              this.tangibleCategoryMapLoaded = true;
              this.loading = false;
            } else {
              this.loading = false;
            }
          }).catch(() => {
            this.loading = false;
          });
      }
    }).catch(() => {
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeIdentifyAssets() {
    this.eventSubscriber = this.eventManager.subscribe('IdentifyAsssetsModification', (response) => this.ngOnInit());
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  selectAssetCategory(key: string) {
    let myAssetsIds: number[];
    this.selectedAssetsByCategory = [];
    if (this.selectedCategory === key) {
      this.selectedCategory = null;
      return;
    }
    if (this.intangibleCategoryMap.has(key)) {
      this.selectedCategory = key;
      myAssetsIds = this.intangibleCategoryMap.get(key);
    } else if (this.tangibleCategoryMap.has(key)) {
      this.selectedCategory = key;
      myAssetsIds = this.tangibleCategoryMap.get(key);
    }
    for (const id of myAssetsIds) {
      const index = _.findIndex(this.myAssets, { id: id as number });
      if (index !== -1) {
        this.selectedAssetsByCategory.push(this.myAssets[index]);
      }
    }
  }
}
