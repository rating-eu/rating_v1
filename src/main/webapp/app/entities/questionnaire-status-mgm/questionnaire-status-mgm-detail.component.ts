import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionnaireStatusMgm } from './questionnaire-status-mgm.model';
import { QuestionnaireStatusMgmService } from './questionnaire-status-mgm.service';

@Component({
    selector: 'jhi-questionnaire-status-mgm-detail',
    templateUrl: './questionnaire-status-mgm-detail.component.html'
})
export class QuestionnaireStatusMgmDetailComponent implements OnInit, OnDestroy {

    questionnaireStatus: QuestionnaireStatusMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestionnaireStatuses();
    }

    load(id) {
        this.questionnaireStatusService.find(id)
            .subscribe((questionnaireStatusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                this.questionnaireStatus = questionnaireStatusResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionnaireStatuses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionnaireStatusListModification',
            (response) => this.load(this.questionnaireStatus.id)
        );
    }
}
