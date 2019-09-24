import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataThreatMgm } from './data-threat-mgm.model';
import { DataThreatMgmService } from './data-threat-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-data-threat-mgm',
    templateUrl: './data-threat-mgm.component.html'
})
export class DataThreatMgmComponent implements OnInit, OnDestroy {
dataThreats: DataThreatMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private dataThreatService: DataThreatMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.dataThreatService.query().subscribe(
            (res: HttpResponse<DataThreatMgm[]>) => {
                this.dataThreats = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInDataThreats();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: DataThreatMgm) {
        return item.id;
    }
    registerChangeInDataThreats() {
        this.eventSubscriber = this.eventManager.subscribe('dataThreatListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
