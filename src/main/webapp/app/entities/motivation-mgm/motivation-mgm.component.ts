import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MotivationMgm } from './motivation-mgm.model';
import { MotivationMgmService } from './motivation-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-motivation-mgm',
    templateUrl: './motivation-mgm.component.html'
})
export class MotivationMgmComponent implements OnInit, OnDestroy {
motivations: MotivationMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private motivationService: MotivationMgmService,
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
            this.motivationService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<MotivationMgm[]>) => this.motivations = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.motivationService.query().subscribe(
            (res: HttpResponse<MotivationMgm[]>) => {
                this.motivations = res.body;
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
        this.registerChangeInMotivations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: MotivationMgm) {
        return item.id;
    }
    registerChangeInMotivations() {
        this.eventSubscriber = this.eventManager.subscribe('motivationListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
