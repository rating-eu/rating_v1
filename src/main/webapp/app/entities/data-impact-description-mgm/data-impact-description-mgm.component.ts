import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataImpactDescriptionMgm } from './data-impact-description-mgm.model';
import { DataImpactDescriptionMgmService } from './data-impact-description-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-data-impact-description-mgm',
    templateUrl: './data-impact-description-mgm.component.html'
})
export class DataImpactDescriptionMgmComponent implements OnInit, OnDestroy {
dataImpactDescriptions: DataImpactDescriptionMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private dataImpactDescriptionService: DataImpactDescriptionMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.dataImpactDescriptionService.query().subscribe(
            (res: HttpResponse<DataImpactDescriptionMgm[]>) => {
                this.dataImpactDescriptions = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInDataImpactDescriptions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: DataImpactDescriptionMgm) {
        return item.id;
    }
    registerChangeInDataImpactDescriptions() {
        this.eventSubscriber = this.eventManager.subscribe('dataImpactDescriptionListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
