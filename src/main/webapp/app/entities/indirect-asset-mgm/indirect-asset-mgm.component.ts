import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IndirectAssetMgm } from './indirect-asset-mgm.model';
import { IndirectAssetMgmService } from './indirect-asset-mgm.service';
import { Principal } from '../../shared';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-indirect-asset-mgm',
    templateUrl: './indirect-asset-mgm.component.html'
})
export class IndirectAssetMgmComponent implements OnInit, OnDestroy {
indirectAssets: IndirectAssetMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private indirectAssetService: IndirectAssetMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        public popUpService: PopUpService
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.indirectAssetService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<IndirectAssetMgm[]>) => this.indirectAssets = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.indirectAssetService.query().subscribe(
            (res: HttpResponse<IndirectAssetMgm[]>) => {
                this.indirectAssets = res.body;
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
        this.registerChangeInIndirectAssets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IndirectAssetMgm) {
        return item.id;
    }
    registerChangeInIndirectAssets() {
        this.eventSubscriber = this.eventManager.subscribe('indirectAssetListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
