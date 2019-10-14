import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { DataImpactDescriptionMgm } from './data-impact-description-mgm.model';
import { DataImpactDescriptionMgmService } from './data-impact-description-mgm.service';

@Component({
    selector: 'jhi-data-impact-description-mgm-detail',
    templateUrl: './data-impact-description-mgm-detail.component.html'
})
export class DataImpactDescriptionMgmDetailComponent implements OnInit, OnDestroy {

    dataImpactDescription: DataImpactDescriptionMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataImpactDescriptionService: DataImpactDescriptionMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDataImpactDescriptions();
    }

    load(id) {
        this.dataImpactDescriptionService.find(id)
            .subscribe((dataImpactDescriptionResponse: HttpResponse<DataImpactDescriptionMgm>) => {
                this.dataImpactDescription = dataImpactDescriptionResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDataImpactDescriptions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'dataImpactDescriptionListModification',
            (response) => this.load(this.dataImpactDescription.id)
        );
    }
}
