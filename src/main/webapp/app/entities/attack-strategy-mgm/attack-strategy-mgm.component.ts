import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AttackStrategyMgm } from './attack-strategy-mgm.model';
import { AttackStrategyMgmService } from './attack-strategy-mgm.service';
import { Principal } from '../../shared';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';
import {MyRole} from '../enumerations/MyRole.enum';

@Component({
    selector: 'jhi-attack-strategy-mgm',
    templateUrl: './attack-strategy-mgm.component.html'
})
export class AttackStrategyMgmComponent implements OnInit, OnDestroy {
attackStrategies: AttackStrategyMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    public isADMIN: boolean;

    constructor(
        private attackStrategyService: AttackStrategyMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        public popUpService: PopUpService
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.attackStrategyService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<AttackStrategyMgm[]>) => this.attackStrategies = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.attackStrategyService.query().subscribe(
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
        this.principal.hasAnyAuthority([MyRole[MyRole.ROLE_ADMIN]]).then((response: boolean) => {
            if (response) {
                this.isADMIN = response;
            } else {
                this.isADMIN = false;
            }
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
