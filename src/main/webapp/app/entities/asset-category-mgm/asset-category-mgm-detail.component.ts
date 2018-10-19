import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { AssetCategoryMgm } from './asset-category-mgm.model';
import { AssetCategoryMgmService } from './asset-category-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-asset-category-mgm-detail',
    templateUrl: './asset-category-mgm-detail.component.html'
})
export class AssetCategoryMgmDetailComponent implements OnInit, OnDestroy {

    assetCategory: AssetCategoryMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private assetCategoryService: AssetCategoryMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAssetCategories();
    }

    load(id) {
        this.assetCategoryService.find(id)
            .subscribe((assetCategoryResponse: HttpResponse<AssetCategoryMgm>) => {
                this.assetCategory = assetCategoryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAssetCategories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'assetCategoryListModification',
            (response) => this.load(this.assetCategory.id)
        );
    }
}
