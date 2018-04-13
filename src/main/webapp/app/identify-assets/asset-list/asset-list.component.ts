import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {AssetMgm} from '../../entities/asset-mgm/asset-mgm.model';
import {IdentifyAssetService} from '../identify-assets.service';
import {Principal} from '../../shared';

@Component({
    selector: 'jhi-asset-list',
    templateUrl: './asset-list.component.html',
    styles: []
})
export class AssetListComponent implements OnInit, OnDestroy {
    assets: AssetMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(private assetService: IdentifyAssetService,
                private jhiAlertService: JhiAlertService,
                private eventManager: JhiEventManager,
                private activatedRoute: ActivatedRoute,
                private principal: Principal) {
    }

    ngOnInit() {
        this.assetService.getAssets();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInIdentifyAsset();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AssetMgm) {
        return item.id;
    }

    registerChangeInIdentifyAsset() {
        this.eventSubscriber =
            this.eventManager.subscribe('identifyAssetListModification', (response) => this.assetService.getAssets());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
