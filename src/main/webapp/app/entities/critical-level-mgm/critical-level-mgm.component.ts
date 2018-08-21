import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CriticalLevelMgm } from './critical-level-mgm.model';
import { CriticalLevelMgmService } from './critical-level-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-critical-level-mgm',
    templateUrl: './critical-level-mgm.component.html'
})
export class CriticalLevelMgmComponent implements OnInit, OnDestroy {
criticalLevels: CriticalLevelMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private criticalLevelService: CriticalLevelMgmService,
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
            this.criticalLevelService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<CriticalLevelMgm[]>) => this.criticalLevels = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.criticalLevelService.query().subscribe(
            (res: HttpResponse<CriticalLevelMgm[]>) => {
                this.criticalLevels = res.body;
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
        this.registerChangeInCriticalLevels();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CriticalLevelMgm) {
        return item.id;
    }
    registerChangeInCriticalLevels() {
        this.eventSubscriber = this.eventManager.subscribe('criticalLevelListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
