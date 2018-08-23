import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyAssetMgm } from './my-asset-mgm.model';
import { MyAssetMgmService } from './my-asset-mgm.service';

@Component({
    selector: 'jhi-my-asset-mgm-detail',
    templateUrl: './my-asset-mgm-detail.component.html'
})
export class MyAssetMgmDetailComponent implements OnInit, OnDestroy {

    myAsset: MyAssetMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private myAssetService: MyAssetMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMyAssets();
    }

    load(id) {
        this.myAssetService.find(id)
            .subscribe((myAssetResponse: HttpResponse<MyAssetMgm>) => {
                this.myAsset = myAssetResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMyAssets() {
        this.eventSubscriber = this.eventManager.subscribe(
            'myAssetListModification',
            (response) => this.load(this.myAsset.id)
        );
    }
}
