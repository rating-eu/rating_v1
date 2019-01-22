import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AttackCostParamMgm } from './attack-cost-param-mgm.model';
import { AttackCostParamMgmService } from './attack-cost-param-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-attack-cost-param-mgm',
    templateUrl: './attack-cost-param-mgm.component.html'
})
export class AttackCostParamMgmComponent implements OnInit, OnDestroy {
attackCostParams: AttackCostParamMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private attackCostParamService: AttackCostParamMgmService,
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
            this.attackCostParamService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<AttackCostParamMgm[]>) => this.attackCostParams = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.attackCostParamService.query().subscribe(
            (res: HttpResponse<AttackCostParamMgm[]>) => {
                this.attackCostParams = res.body;
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
        this.registerChangeInAttackCostParams();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AttackCostParamMgm) {
        return item.id;
    }
    registerChangeInAttackCostParams() {
        this.eventSubscriber = this.eventManager.subscribe('attackCostParamListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
