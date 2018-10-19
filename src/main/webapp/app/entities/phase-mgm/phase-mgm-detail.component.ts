import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { PhaseMgm } from './phase-mgm.model';
import { PhaseMgmService } from './phase-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-phase-mgm-detail',
    templateUrl: './phase-mgm-detail.component.html'
})
export class PhaseMgmDetailComponent implements OnInit, OnDestroy {

    phase: PhaseMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private phaseService: PhaseMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPhases();
    }

    load(id) {
        this.phaseService.find(id)
            .subscribe((phaseResponse: HttpResponse<PhaseMgm>) => {
                this.phase = phaseResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPhases() {
        this.eventSubscriber = this.eventManager.subscribe(
            'phaseListModification',
            (response) => this.load(this.phase.id)
        );
    }
}
