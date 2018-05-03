import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LikelihoodPositionMgm } from './likelihood-position-mgm.model';
import { LikelihoodPositionMgmService } from './likelihood-position-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-likelihood-position-mgm',
    templateUrl: './likelihood-position-mgm.component.html'
})
export class LikelihoodPositionMgmComponent implements OnInit, OnDestroy {
likelihoodPositions: LikelihoodPositionMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private likelihoodPositionService: LikelihoodPositionMgmService,
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
            this.likelihoodPositionService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<LikelihoodPositionMgm[]>) => this.likelihoodPositions = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.likelihoodPositionService.query().subscribe(
            (res: HttpResponse<LikelihoodPositionMgm[]>) => {
                this.likelihoodPositions = res.body;
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
        this.registerChangeInLikelihoodPositions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LikelihoodPositionMgm) {
        return item.id;
    }
    registerChangeInLikelihoodPositions() {
        this.eventSubscriber = this.eventManager.subscribe('likelihoodPositionListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
