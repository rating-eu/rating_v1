import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AssetMgm } from './asset-mgm.model';
import { AssetMgmService } from './asset-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-asset-mgm',
    templateUrl: './asset-mgm.component.html'
})
export class AssetMgmComponent implements OnInit, OnDestroy {
assets: AssetMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private assetService: AssetMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.assetService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<AssetMgm[]>) => this.assets = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.assetService.query().subscribe(
            (res: HttpResponse<AssetMgm[]>) => {
                this.assets = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInAssets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AssetMgm) {
        return item.id;
    }
    registerChangeInAssets() {
        this.eventSubscriber = this.eventManager.subscribe('assetListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
