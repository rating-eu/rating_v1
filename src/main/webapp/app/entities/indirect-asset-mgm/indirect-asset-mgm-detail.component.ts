import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { IndirectAssetMgm } from './indirect-asset-mgm.model';
import { IndirectAssetMgmService } from './indirect-asset-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-indirect-asset-mgm-detail',
    templateUrl: './indirect-asset-mgm-detail.component.html'
})
export class IndirectAssetMgmDetailComponent implements OnInit, OnDestroy {

    indirectAsset: IndirectAssetMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private indirectAssetService: IndirectAssetMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInIndirectAssets();
    }

    load(id) {
        this.indirectAssetService.find(id)
            .subscribe((indirectAssetResponse: HttpResponse<IndirectAssetMgm>) => {
                this.indirectAsset = indirectAssetResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInIndirectAssets() {
        this.eventSubscriber = this.eventManager.subscribe(
            'indirectAssetListModification',
            (response) => this.load(this.indirectAsset.id)
        );
    }
}
