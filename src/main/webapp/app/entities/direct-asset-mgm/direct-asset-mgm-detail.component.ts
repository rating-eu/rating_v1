import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { DirectAssetMgm } from './direct-asset-mgm.model';
import { DirectAssetMgmService } from './direct-asset-mgm.service';

@Component({
    selector: 'jhi-direct-asset-mgm-detail',
    templateUrl: './direct-asset-mgm-detail.component.html'
})
export class DirectAssetMgmDetailComponent implements OnInit, OnDestroy {

    directAsset: DirectAssetMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private directAssetService: DirectAssetMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDirectAssets();
    }

    load(id) {
        this.directAssetService.find(id)
            .subscribe((directAssetResponse: HttpResponse<DirectAssetMgm>) => {
                this.directAsset = directAssetResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDirectAssets() {
        this.eventSubscriber = this.eventManager.subscribe(
            'directAssetListModification',
            (response) => this.load(this.directAsset.id)
        );
    }
}
