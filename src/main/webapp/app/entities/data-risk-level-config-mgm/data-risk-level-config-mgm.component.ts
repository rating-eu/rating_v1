import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataRiskLevelConfigMgm } from './data-risk-level-config-mgm.model';
import { DataRiskLevelConfigMgmService } from './data-risk-level-config-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-data-risk-level-config-mgm',
    templateUrl: './data-risk-level-config-mgm.component.html'
})
export class DataRiskLevelConfigMgmComponent implements OnInit, OnDestroy {
dataRiskLevelConfigs: DataRiskLevelConfigMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private dataRiskLevelConfigService: DataRiskLevelConfigMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.dataRiskLevelConfigService.query().subscribe(
            (res: HttpResponse<DataRiskLevelConfigMgm[]>) => {
                this.dataRiskLevelConfigs = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInDataRiskLevelConfigs();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: DataRiskLevelConfigMgm) {
        return item.id;
    }
    registerChangeInDataRiskLevelConfigs() {
        this.eventSubscriber = this.eventManager.subscribe('dataRiskLevelConfigListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
