import {Component, OnInit} from '@angular/core';
import {AssetCategoryMgm, AssetCategoryMgmService} from "../../../entities/asset-category-mgm";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {switchMap} from "rxjs/operators";
import {MyAssetMgm, MyAssetMgmService} from "../../../entities/my-asset-mgm";
import {SelfAssessmentMgm} from "../../../entities/self-assessment-mgm";
import {DatasharingService} from "../../../datasharing/datasharing.service";
import {forkJoin} from "rxjs/observable/forkJoin";
import {IdentifyAssetUtilService} from "../../../identify-assets/identify-asset.util.service";

@Component({
    selector: 'jhi-assets-impact',
    templateUrl: './assets-impact.component.html',
    styles: []
})
export class AssetsImpactComponent implements OnInit {

    private selfAssessment: SelfAssessmentMgm;
    private assetCategories$: Observable<HttpResponse<AssetCategoryMgm[]>>;
    public assetCategories: AssetCategoryMgm[];
    public myAssetsByCategoriesMap: Map<number/*AssetCategoryID*/, MyAssetMgm[]>;
    private myAssets: MyAssetMgm[] = [];
    public priorities = ['Low', 'Low medium', 'Medium', 'Medium high', 'High'];

    constructor(private assetCategoryService: AssetCategoryMgmService,
                private myAssetService: MyAssetMgmService,
                private dataSharing: DatasharingService) {
    }

    ngOnInit() {
        this.selfAssessment = this.dataSharing.selfAssessment;
        this.myAssets = [];

        this.myAssetsByCategoriesMap = new Map();
        this.assetCategories$ = this.assetCategoryService.findAll();

        const assetsByCategories$: Observable<HttpResponse<MyAssetMgm[]>[]> = this.assetCategories$.pipe(
            switchMap((categoriesResponse: HttpResponse<AssetCategoryMgm[]>) => {

                this.assetCategories = categoriesResponse.body;

                const assetsByCategoriesArray: Observable<HttpResponse<MyAssetMgm[]>>[] = [];

                if (this.assetCategories) {
                    this.assetCategories.forEach(category => {
                        assetsByCategoriesArray.push(this.myAssetService.getAllBySelfAssessmentAndAssetCategory(this.selfAssessment.id, category));
                    });
                }

                return forkJoin(assetsByCategoriesArray);
            })
        );

        assetsByCategories$.subscribe((response: HttpResponse<MyAssetMgm[]>[]) => {
            if (response && response.length) {

                response.forEach((assetsByCategoryResponse: HttpResponse<MyAssetMgm[]>) => {
                    const myAssets: MyAssetMgm[] = assetsByCategoryResponse.body;
                    // https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Operators/Spread_syntax
                    this.myAssets.push(...myAssets);

                    if (myAssets && myAssets.length) {
                        const sampleMyAsset: MyAssetMgm = assetsByCategoryResponse.body[0];
                        const cat: AssetCategoryMgm = sampleMyAsset.asset.assetcategory;

                        this.myAssetsByCategoriesMap.set(cat.id, myAssets);
                    }
                });
            }
        });
    }

    saveMyAssets() {
        const saveMyAssets$: Observable<HttpResponse<MyAssetMgm[]>> = this.myAssetService.saveMyAssets(this.selfAssessment, this.myAssets);

        saveMyAssets$.subscribe((response: HttpResponse<MyAssetMgm[]>) => {
            this.myAssets = response.body;
        });
    }
}
