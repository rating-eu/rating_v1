import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataRecipientMgm } from './data-recipient-mgm.model';
import { DataRecipientMgmService } from './data-recipient-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-data-recipient-mgm',
    templateUrl: './data-recipient-mgm.component.html'
})
export class DataRecipientMgmComponent implements OnInit, OnDestroy {
dataRecipients: DataRecipientMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private dataRecipientService: DataRecipientMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.dataRecipientService.query().subscribe(
            (res: HttpResponse<DataRecipientMgm[]>) => {
                this.dataRecipients = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInDataRecipients();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: DataRecipientMgm) {
        return item.id;
    }
    registerChangeInDataRecipients() {
        this.eventSubscriber = this.eventManager.subscribe('dataRecipientListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
