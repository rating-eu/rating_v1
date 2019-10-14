import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { OverallDataRiskMgm } from './overall-data-risk-mgm.model';
import { OverallDataRiskMgmService } from './overall-data-risk-mgm.service';

@Component({
    selector: 'jhi-overall-data-risk-mgm-detail',
    templateUrl: './overall-data-risk-mgm-detail.component.html'
})
export class OverallDataRiskMgmDetailComponent implements OnInit, OnDestroy {

    overallDataRisk: OverallDataRiskMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private overallDataRiskService: OverallDataRiskMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOverallDataRisks();
    }

    load(id) {
        this.overallDataRiskService.find(id)
            .subscribe((overallDataRiskResponse: HttpResponse<OverallDataRiskMgm>) => {
                this.overallDataRisk = overallDataRiskResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOverallDataRisks() {
        this.eventSubscriber = this.eventManager.subscribe(
            'overallDataRiskListModification',
            (response) => this.load(this.overallDataRisk.id)
        );
    }
}
