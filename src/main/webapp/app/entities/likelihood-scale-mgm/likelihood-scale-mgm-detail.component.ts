import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LikelihoodScaleMgm } from './likelihood-scale-mgm.model';
import { LikelihoodScaleMgmService } from './likelihood-scale-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-likelihood-scale-mgm-detail',
    templateUrl: './likelihood-scale-mgm-detail.component.html'
})
export class LikelihoodScaleMgmDetailComponent implements OnInit, OnDestroy {

    likelihoodScale: LikelihoodScaleMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private likelihoodScaleService: LikelihoodScaleMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLikelihoodScales();
    }

    load(id) {
        this.likelihoodScaleService.find(id)
            .subscribe((likelihoodScaleResponse: HttpResponse<LikelihoodScaleMgm>) => {
                this.likelihoodScale = likelihoodScaleResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLikelihoodScales() {
        this.eventSubscriber = this.eventManager.subscribe(
            'likelihoodScaleListModification',
            (response) => this.load(this.likelihoodScale.id)
        );
    }
}
