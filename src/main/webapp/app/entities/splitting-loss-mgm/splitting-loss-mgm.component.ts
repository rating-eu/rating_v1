import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SplittingLossMgm } from './splitting-loss-mgm.model';
import { SplittingLossMgmService } from './splitting-loss-mgm.service';
import { Principal } from '../../shared';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-splitting-loss-mgm',
    templateUrl: './splitting-loss-mgm.component.html'
})
export class SplittingLossMgmComponent implements OnInit, OnDestroy {
splittingLosses: SplittingLossMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private splittingLossService: SplittingLossMgmService,
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
            this.splittingLossService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<SplittingLossMgm[]>) => this.splittingLosses = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.splittingLossService.query().subscribe(
            (res: HttpResponse<SplittingLossMgm[]>) => {
                this.splittingLosses = res.body;
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
        this.registerChangeInSplittingLosses();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SplittingLossMgm) {
        return item.id;
    }
    registerChangeInSplittingLosses() {
        this.eventSubscriber = this.eventManager.subscribe('splittingLossListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
