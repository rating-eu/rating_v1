import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EconomicResultsMgm } from './economic-results-mgm.model';
import { EconomicResultsMgmService } from './economic-results-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-economic-results-mgm',
    templateUrl: './economic-results-mgm.component.html'
})
export class EconomicResultsMgmComponent implements OnInit, OnDestroy {
economicResults: EconomicResultsMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private economicResultsService: EconomicResultsMgmService,
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
            this.economicResultsService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<EconomicResultsMgm[]>) => this.economicResults = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.economicResultsService.query().subscribe(
            (res: HttpResponse<EconomicResultsMgm[]>) => {
                this.economicResults = res.body;
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
        this.registerChangeInEconomicResults();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: EconomicResultsMgm) {
        return item.id;
    }
    registerChangeInEconomicResults() {
        this.eventSubscriber = this.eventManager.subscribe('economicResultsListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
