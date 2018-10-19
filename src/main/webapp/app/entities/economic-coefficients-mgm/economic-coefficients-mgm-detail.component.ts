import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { EconomicCoefficientsMgm } from './economic-coefficients-mgm.model';
import { EconomicCoefficientsMgmService } from './economic-coefficients-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-economic-coefficients-mgm-detail',
    templateUrl: './economic-coefficients-mgm-detail.component.html'
})
export class EconomicCoefficientsMgmDetailComponent implements OnInit, OnDestroy {

    economicCoefficients: EconomicCoefficientsMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private economicCoefficientsService: EconomicCoefficientsMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEconomicCoefficients();
    }

    load(id) {
        this.economicCoefficientsService.find(id)
            .subscribe((economicCoefficientsResponse: HttpResponse<EconomicCoefficientsMgm>) => {
                this.economicCoefficients = economicCoefficientsResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEconomicCoefficients() {
        this.eventSubscriber = this.eventManager.subscribe(
            'economicCoefficientsListModification',
            (response) => this.load(this.economicCoefficients.id)
        );
    }
}
