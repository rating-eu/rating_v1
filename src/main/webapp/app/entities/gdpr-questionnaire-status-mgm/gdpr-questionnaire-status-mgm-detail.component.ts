import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRQuestionnaireStatusMgm } from './gdpr-questionnaire-status-mgm.model';
import { GDPRQuestionnaireStatusMgmService } from './gdpr-questionnaire-status-mgm.service';

@Component({
    selector: 'jhi-gdpr-questionnaire-status-mgm-detail',
    templateUrl: './gdpr-questionnaire-status-mgm-detail.component.html'
})
export class GDPRQuestionnaireStatusMgmDetailComponent implements OnInit, OnDestroy {

    gDPRQuestionnaireStatus: GDPRQuestionnaireStatusMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private gDPRQuestionnaireStatusService: GDPRQuestionnaireStatusMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInGDPRQuestionnaireStatuses();
    }

    load(id) {
        this.gDPRQuestionnaireStatusService.find(id)
            .subscribe((gDPRQuestionnaireStatusResponse: HttpResponse<GDPRQuestionnaireStatusMgm>) => {
                this.gDPRQuestionnaireStatus = gDPRQuestionnaireStatusResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInGDPRQuestionnaireStatuses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'gDPRQuestionnaireStatusListModification',
            (response) => this.load(this.gDPRQuestionnaireStatus.id)
        );
    }
}
