import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { OverallDataThreatMgm } from './overall-data-threat-mgm.model';
import { OverallDataThreatMgmService } from './overall-data-threat-mgm.service';

@Component({
    selector: 'jhi-overall-data-threat-mgm-detail',
    templateUrl: './overall-data-threat-mgm-detail.component.html'
})
export class OverallDataThreatMgmDetailComponent implements OnInit, OnDestroy {

    overallDataThreat: OverallDataThreatMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private overallDataThreatService: OverallDataThreatMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOverallDataThreats();
    }

    load(id) {
        this.overallDataThreatService.find(id)
            .subscribe((overallDataThreatResponse: HttpResponse<OverallDataThreatMgm>) => {
                this.overallDataThreat = overallDataThreatResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOverallDataThreats() {
        this.eventSubscriber = this.eventManager.subscribe(
            'overallDataThreatListModification',
            (response) => this.load(this.overallDataThreat.id)
        );
    }
}
