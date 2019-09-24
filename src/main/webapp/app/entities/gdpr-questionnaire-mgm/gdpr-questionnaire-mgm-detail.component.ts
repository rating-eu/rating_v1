import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRQuestionnaireMgm } from './gdpr-questionnaire-mgm.model';
import { GDPRQuestionnaireMgmService } from './gdpr-questionnaire-mgm.service';

@Component({
    selector: 'jhi-gdpr-questionnaire-mgm-detail',
    templateUrl: './gdpr-questionnaire-mgm-detail.component.html'
})
export class GDPRQuestionnaireMgmDetailComponent implements OnInit, OnDestroy {

    gDPRQuestionnaire: GDPRQuestionnaireMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private gDPRQuestionnaireService: GDPRQuestionnaireMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInGDPRQuestionnaires();
    }

    load(id) {
        this.gDPRQuestionnaireService.find(id)
            .subscribe((gDPRQuestionnaireResponse: HttpResponse<GDPRQuestionnaireMgm>) => {
                this.gDPRQuestionnaire = gDPRQuestionnaireResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInGDPRQuestionnaires() {
        this.eventSubscriber = this.eventManager.subscribe(
            'gDPRQuestionnaireListModification',
            (response) => this.load(this.gDPRQuestionnaire.id)
        );
    }
}
