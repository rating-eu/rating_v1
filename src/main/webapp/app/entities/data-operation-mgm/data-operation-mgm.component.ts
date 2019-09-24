import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataOperationMgm } from './data-operation-mgm.model';
import { DataOperationMgmService } from './data-operation-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-data-operation-mgm',
    templateUrl: './data-operation-mgm.component.html'
})
export class DataOperationMgmComponent implements OnInit, OnDestroy {
dataOperations: DataOperationMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private dataOperationService: DataOperationMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.dataOperationService.query().subscribe(
            (res: HttpResponse<DataOperationMgm[]>) => {
                this.dataOperations = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInDataOperations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: DataOperationMgm) {
        return item.id;
    }
    registerChangeInDataOperations() {
        this.eventSubscriber = this.eventManager.subscribe('dataOperationListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
