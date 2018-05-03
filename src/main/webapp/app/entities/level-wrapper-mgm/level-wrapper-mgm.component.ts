import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LevelWrapperMgm } from './level-wrapper-mgm.model';
import { LevelWrapperMgmService } from './level-wrapper-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-level-wrapper-mgm',
    templateUrl: './level-wrapper-mgm.component.html'
})
export class LevelWrapperMgmComponent implements OnInit, OnDestroy {
levelWrappers: LevelWrapperMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private levelWrapperService: LevelWrapperMgmService,
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
            this.levelWrapperService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<LevelWrapperMgm[]>) => this.levelWrappers = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.levelWrapperService.query().subscribe(
            (res: HttpResponse<LevelWrapperMgm[]>) => {
                this.levelWrappers = res.body;
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
        this.registerChangeInLevelWrappers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LevelWrapperMgm) {
        return item.id;
    }
    registerChangeInLevelWrappers() {
        this.eventSubscriber = this.eventManager.subscribe('levelWrapperListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
