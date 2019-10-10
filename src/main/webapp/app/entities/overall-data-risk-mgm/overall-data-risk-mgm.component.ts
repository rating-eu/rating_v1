import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OverallDataRiskMgm } from './overall-data-risk-mgm.model';
import { OverallDataRiskMgmService } from './overall-data-risk-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-overall-data-risk-mgm',
    templateUrl: './overall-data-risk-mgm.component.html'
})
export class OverallDataRiskMgmComponent implements OnInit, OnDestroy {
overallDataRisks: OverallDataRiskMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private overallDataRiskService: OverallDataRiskMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.overallDataRiskService.query().subscribe(
            (res: HttpResponse<OverallDataRiskMgm[]>) => {
                this.overallDataRisks = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInOverallDataRisks();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: OverallDataRiskMgm) {
        return item.id;
    }
    registerChangeInOverallDataRisks() {
        this.eventSubscriber = this.eventManager.subscribe('overallDataRiskListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
