import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PhaseWrapperMgm } from './phase-wrapper-mgm.model';
import { PhaseWrapperMgmService } from './phase-wrapper-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-phase-wrapper-mgm',
    templateUrl: './phase-wrapper-mgm.component.html'
})
export class PhaseWrapperMgmComponent implements OnInit, OnDestroy {
phaseWrappers: PhaseWrapperMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private phaseWrapperService: PhaseWrapperMgmService,
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
            this.phaseWrapperService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<PhaseWrapperMgm[]>) => this.phaseWrappers = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.phaseWrapperService.query().subscribe(
            (res: HttpResponse<PhaseWrapperMgm[]>) => {
                this.phaseWrappers = res.body;
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
        this.registerChangeInPhaseWrappers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: PhaseWrapperMgm) {
        return item.id;
    }
    registerChangeInPhaseWrappers() {
        this.eventSubscriber = this.eventManager.subscribe('phaseWrapperListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
