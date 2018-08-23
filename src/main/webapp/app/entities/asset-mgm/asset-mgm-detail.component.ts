import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { AssetMgm } from './asset-mgm.model';
import { AssetMgmService } from './asset-mgm.service';

@Component({
    selector: 'jhi-asset-mgm-detail',
    templateUrl: './asset-mgm-detail.component.html'
})
export class AssetMgmDetailComponent implements OnInit, OnDestroy {

    asset: AssetMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private assetService: AssetMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAssets();
    }

    load(id) {
        this.assetService.find(id)
            .subscribe((assetResponse: HttpResponse<AssetMgm>) => {
                this.asset = assetResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAssets() {
        this.eventSubscriber = this.eventManager.subscribe(
            'assetListModification',
            (response) => this.load(this.asset.id)
        );
    }
}
