import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MyAssetMgm } from './my-asset-mgm.model';
import { MyAssetMgmService } from './my-asset-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-my-asset-mgm',
    templateUrl: './my-asset-mgm.component.html'
})
export class MyAssetMgmComponent implements OnInit, OnDestroy {
myAssets: MyAssetMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private myAssetService: MyAssetMgmService,
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
            this.myAssetService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<MyAssetMgm[]>) => this.myAssets = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.myAssetService.query().subscribe(
            (res: HttpResponse<MyAssetMgm[]>) => {
                this.myAssets = res.body;
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
        this.registerChangeInMyAssets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: MyAssetMgm) {
        return item.id;
    }
    registerChangeInMyAssets() {
        this.eventSubscriber = this.eventManager.subscribe('myAssetListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
