import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SplittingValueMgm } from './splitting-value-mgm.model';
import { SplittingValueMgmService } from './splitting-value-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-splitting-value-mgm',
    templateUrl: './splitting-value-mgm.component.html'
})
export class SplittingValueMgmComponent implements OnInit, OnDestroy {
splittingValues: SplittingValueMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private splittingValueService: SplittingValueMgmService,
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
            this.splittingValueService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<SplittingValueMgm[]>) => this.splittingValues = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.splittingValueService.query().subscribe(
            (res: HttpResponse<SplittingValueMgm[]>) => {
                this.splittingValues = res.body;
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
        this.registerChangeInSplittingValues();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SplittingValueMgm) {
        return item.id;
    }
    registerChangeInSplittingValues() {
        this.eventSubscriber = this.eventManager.subscribe('splittingValueListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
