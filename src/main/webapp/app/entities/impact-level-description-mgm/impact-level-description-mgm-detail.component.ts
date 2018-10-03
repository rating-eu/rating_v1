import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ImpactLevelDescriptionMgm } from './impact-level-description-mgm.model';
import { ImpactLevelDescriptionMgmService } from './impact-level-description-mgm.service';

@Component({
    selector: 'jhi-impact-level-description-mgm-detail',
    templateUrl: './impact-level-description-mgm-detail.component.html'
})
export class ImpactLevelDescriptionMgmDetailComponent implements OnInit, OnDestroy {

    impactLevelDescription: ImpactLevelDescriptionMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private impactLevelDescriptionService: ImpactLevelDescriptionMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInImpactLevelDescriptions();
    }

    load(id) {
        this.impactLevelDescriptionService.find(id)
            .subscribe((impactLevelDescriptionResponse: HttpResponse<ImpactLevelDescriptionMgm>) => {
                this.impactLevelDescription = impactLevelDescriptionResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInImpactLevelDescriptions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'impactLevelDescriptionListModification',
            (response) => this.load(this.impactLevelDescription.id)
        );
    }
}
