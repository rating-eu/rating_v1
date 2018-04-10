import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CompanySectorMgm } from './company-sector-mgm.model';
import { CompanySectorMgmService } from './company-sector-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-company-sector-mgm',
    templateUrl: './company-sector-mgm.component.html'
})
export class CompanySectorMgmComponent implements OnInit, OnDestroy {
companySectors: CompanySectorMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private companySectorService: CompanySectorMgmService,
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
            this.companySectorService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<CompanySectorMgm[]>) => this.companySectors = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.companySectorService.query().subscribe(
            (res: HttpResponse<CompanySectorMgm[]>) => {
                this.companySectors = res.body;
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
        this.registerChangeInCompanySectors();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CompanySectorMgm) {
        return item.id;
    }
    registerChangeInCompanySectors() {
        this.eventSubscriber = this.eventManager.subscribe('companySectorListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
