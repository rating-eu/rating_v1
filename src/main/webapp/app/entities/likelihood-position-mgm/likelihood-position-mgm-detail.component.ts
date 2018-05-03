import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LikelihoodPositionMgm } from './likelihood-position-mgm.model';
import { LikelihoodPositionMgmService } from './likelihood-position-mgm.service';

@Component({
    selector: 'jhi-likelihood-position-mgm-detail',
    templateUrl: './likelihood-position-mgm-detail.component.html'
})
export class LikelihoodPositionMgmDetailComponent implements OnInit, OnDestroy {

    likelihoodPosition: LikelihoodPositionMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private likelihoodPositionService: LikelihoodPositionMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLikelihoodPositions();
    }

    load(id) {
        this.likelihoodPositionService.find(id)
            .subscribe((likelihoodPositionResponse: HttpResponse<LikelihoodPositionMgm>) => {
                this.likelihoodPosition = likelihoodPositionResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLikelihoodPositions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'likelihoodPositionListModification',
            (response) => this.load(this.likelihoodPosition.id)
        );
    }
}
