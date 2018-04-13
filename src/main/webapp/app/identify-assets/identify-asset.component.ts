import {Component, OnInit, OnDestroy} from '@angular/core';
import {Principal} from '../shared';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';
import {IdentifyAssetService} from './identify-asset.service';
import {AssetMgm} from '../entities/asset-mgm/asset-mgm.model';

@Component({
    selector: 'jhi-identify-asset',
    templateUrl: './identify-asset.component.html',
    providers: [IdentifyAssetService]
})
export class IdentifyAssetComponent implements OnInit, OnDestroy {
    account: Account;
    assets: AssetMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private identifyAssetService: IdentifyAssetService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal) {
    }

    ngOnInit() {
        this.getAllAssets();
    }

    getAllAssets() {
        this.identifyAssetService.findAll().subscribe(
            (res: HttpResponse<AssetMgm[]>) => this.assets = res.body,
            (res: HttpErrorResponse) => this.onError(res.message));
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AssetMgm) {
        return item.id;
    }

    registerChangeInAttackStrategies() {
        this.eventSubscriber = this.eventManager.subscribe('attackStrategyListModification', (response) => this.getAllAssets());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
