import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { EconomicResultsMgm } from './economic-results-mgm.model';
import { EconomicResultsMgmService } from './economic-results-mgm.service';

@Component({
    selector: 'jhi-economic-results-mgm-detail',
    templateUrl: './economic-results-mgm-detail.component.html'
})
export class EconomicResultsMgmDetailComponent implements OnInit, OnDestroy {

    economicResults: EconomicResultsMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private economicResultsService: EconomicResultsMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEconomicResults();
    }

    load(id) {
        this.economicResultsService.find(id)
            .subscribe((economicResultsResponse: HttpResponse<EconomicResultsMgm>) => {
                this.economicResults = economicResultsResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEconomicResults() {
        this.eventSubscriber = this.eventManager.subscribe(
            'economicResultsListModification',
            (response) => this.load(this.economicResults.id)
        );
    }
}