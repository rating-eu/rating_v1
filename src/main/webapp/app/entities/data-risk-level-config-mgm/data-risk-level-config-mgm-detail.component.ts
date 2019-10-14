import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { DataRiskLevelConfigMgm } from './data-risk-level-config-mgm.model';
import { DataRiskLevelConfigMgmService } from './data-risk-level-config-mgm.service';

@Component({
    selector: 'jhi-data-risk-level-config-mgm-detail',
    templateUrl: './data-risk-level-config-mgm-detail.component.html'
})
export class DataRiskLevelConfigMgmDetailComponent implements OnInit, OnDestroy {

    dataRiskLevelConfig: DataRiskLevelConfigMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataRiskLevelConfigService: DataRiskLevelConfigMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDataRiskLevelConfigs();
    }

    load(id) {
        this.dataRiskLevelConfigService.find(id)
            .subscribe((dataRiskLevelConfigResponse: HttpResponse<DataRiskLevelConfigMgm>) => {
                this.dataRiskLevelConfig = dataRiskLevelConfigResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDataRiskLevelConfigs() {
        this.eventSubscriber = this.eventManager.subscribe(
            'dataRiskLevelConfigListModification',
            (response) => this.load(this.dataRiskLevelConfig.id)
        );
    }
}
