import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ImpactLevelMgm } from './impact-level-mgm.model';
import { ImpactLevelMgmService } from './impact-level-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-impact-level-mgm',
    templateUrl: './impact-level-mgm.component.html'
})
export class ImpactLevelMgmComponent implements OnInit, OnDestroy {
impactLevels: ImpactLevelMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private impactLevelService: ImpactLevelMgmService,
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
            this.impactLevelService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<ImpactLevelMgm[]>) => this.impactLevels = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.impactLevelService.query().subscribe(
            (res: HttpResponse<ImpactLevelMgm[]>) => {
                this.impactLevels = res.body;
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
        this.registerChangeInImpactLevels();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ImpactLevelMgm) {
        return item.id;
    }
    registerChangeInImpactLevels() {
        this.eventSubscriber = this.eventManager.subscribe('impactLevelListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
