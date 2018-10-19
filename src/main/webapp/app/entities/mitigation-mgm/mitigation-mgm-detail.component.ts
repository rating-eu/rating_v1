import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MitigationMgm } from './mitigation-mgm.model';
import { MitigationMgmService } from './mitigation-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-mitigation-mgm-detail',
    templateUrl: './mitigation-mgm-detail.component.html'
})
export class MitigationMgmDetailComponent implements OnInit, OnDestroy {

    mitigation: MitigationMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private mitigationService: MitigationMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMitigations();
    }

    load(id) {
        this.mitigationService.find(id)
            .subscribe((mitigationResponse: HttpResponse<MitigationMgm>) => {
                this.mitigation = mitigationResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMitigations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'mitigationListModification',
            (response) => this.load(this.mitigation.id)
        );
    }
}
