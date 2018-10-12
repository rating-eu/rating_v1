import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ImpactLevelDescriptionMgm } from './impact-level-description-mgm.model';
import { ImpactLevelDescriptionMgmService } from './impact-level-description-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-impact-level-description-mgm',
    templateUrl: './impact-level-description-mgm.component.html'
})
export class ImpactLevelDescriptionMgmComponent implements OnInit, OnDestroy {
impactLevelDescriptions: ImpactLevelDescriptionMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private impactLevelDescriptionService: ImpactLevelDescriptionMgmService,
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
            this.impactLevelDescriptionService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<ImpactLevelDescriptionMgm[]>) => this.impactLevelDescriptions = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.impactLevelDescriptionService.query().subscribe(
            (res: HttpResponse<ImpactLevelDescriptionMgm[]>) => {
                this.impactLevelDescriptions = res.body;
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
        this.registerChangeInImpactLevelDescriptions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ImpactLevelDescriptionMgm) {
        return item.id;
    }
    registerChangeInImpactLevelDescriptions() {
        this.eventSubscriber = this.eventManager.subscribe('impactLevelDescriptionListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}