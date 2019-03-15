import * as _ from 'lodash';
import {MyAssetMgm} from './../../entities/my-asset-mgm/my-asset-mgm.model';
import {Router, NavigationStart} from '@angular/router';
import {ImpactEvaluationService} from './../impact-evaluation.service';
import {Component, OnInit} from '@angular/core';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {MyAssetMgmService} from '../../entities/my-asset-mgm';
import {Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {forkJoin} from 'rxjs/observable/forkJoin';

@Component({
    selector: 'jhi-data-assets-losses-estimation',
    templateUrl: './data-assets-losses-estimation.component.html',
    styles: []
})
export class DataAssetsLossesEstimationComponent implements OnInit {
    private mySelf: SelfAssessmentMgm;
    public dataAssets: MyAssetMgm[] = [];

    constructor(
        private impactService: ImpactEvaluationService,
        private router: Router,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private myAssetService: MyAssetMgmService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (this.mySelf) {
                    console.log('Send start impacts Evaluation request!');
                    this.impactService.getImpacts(this.mySelf).toPromise();
                }
            }
        });
    }

    ngOnInit() {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.impactService.getMyAssets(this.mySelf).toPromise().then((res) => {
            if (res) {
                res.forEach((asset) => {
                    if (asset.asset.assetcategory.name === 'Data') {
                        this.dataAssets.push(asset);
                    }
                });
            }
        });
    }

    public updateDataAssets() {
        const dataAssetsUpdate: Observable<HttpResponse<MyAssetMgm>>[] = [];

        this.dataAssets.forEach((asset) => {
            dataAssetsUpdate.push(this.myAssetService.update(asset));
        });

        const dataAssetsUpdate$ = forkJoin(dataAssetsUpdate);

        dataAssetsUpdate$.toPromise().then((res: HttpResponse<MyAssetMgm>[]) => {
            if (res) {

                for (const value of res) {
                    const updatedAsset = value.body;
                    const index = _.findIndex(this.dataAssets, {id: updatedAsset.id});
                    this.dataAssets.splice(index, 1, updatedAsset);
                }

                window.history.back();
            }
        });
    }

    public close() {
        this.router.navigate(['/dashboard']);
    }

}
