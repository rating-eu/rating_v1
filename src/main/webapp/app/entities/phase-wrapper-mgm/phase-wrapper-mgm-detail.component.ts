import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { PhaseWrapperMgm } from './phase-wrapper-mgm.model';
import { PhaseWrapperMgmService } from './phase-wrapper-mgm.service';

@Component({
    selector: 'jhi-phase-wrapper-mgm-detail',
    templateUrl: './phase-wrapper-mgm-detail.component.html'
})
export class PhaseWrapperMgmDetailComponent implements OnInit, OnDestroy {

    phaseWrapper: PhaseWrapperMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private phaseWrapperService: PhaseWrapperMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPhaseWrappers();
    }

    load(id) {
        this.phaseWrapperService.find(id)
            .subscribe((phaseWrapperResponse: HttpResponse<PhaseWrapperMgm>) => {
                this.phaseWrapper = phaseWrapperResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPhaseWrappers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'phaseWrapperListModification',
            (response) => this.load(this.phaseWrapper.id)
        );
    }
}
