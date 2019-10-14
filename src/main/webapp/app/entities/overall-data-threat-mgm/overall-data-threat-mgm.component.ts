import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OverallDataThreatMgm } from './overall-data-threat-mgm.model';
import { OverallDataThreatMgmService } from './overall-data-threat-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-overall-data-threat-mgm',
    templateUrl: './overall-data-threat-mgm.component.html'
})
export class OverallDataThreatMgmComponent implements OnInit, OnDestroy {
overallDataThreats: OverallDataThreatMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private overallDataThreatService: OverallDataThreatMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.overallDataThreatService.query().subscribe(
            (res: HttpResponse<OverallDataThreatMgm[]>) => {
                this.overallDataThreats = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInOverallDataThreats();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: OverallDataThreatMgm) {
        return item.id;
    }
    registerChangeInOverallDataThreats() {
        this.eventSubscriber = this.eventManager.subscribe('overallDataThreatListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
