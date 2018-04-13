import { Component, OnInit } from '@angular/core';
import { Principal } from '../shared';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AttackStrategyMgm } from '../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import { EvaluateService } from './evaluate-weackness.service';
import { HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { OnDestroy } from '@angular/core';

@Component({
    selector: 'jhi-evaluate-weackness',
    templateUrl: './evaluate-weackness.component.html'
})
export class EvaluateWeacknessComponent implements OnInit , OnDestroy {
   attackStrategies: AttackStrategyMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private evaluateService: EvaluateService,
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
            this.evaluateService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<AttackStrategyMgm[]>) => this.attackStrategies = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.evaluateService.query().subscribe(
            (res: HttpResponse<AttackStrategyMgm[]>) => {
                this.attackStrategies = res.body;
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
        this.registerChangeInAttackStrategies();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AttackStrategyMgm) {
        return item.id;
    }
    registerChangeInAttackStrategies() {
        this.eventSubscriber = this.eventManager.subscribe('attackStrategyListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
