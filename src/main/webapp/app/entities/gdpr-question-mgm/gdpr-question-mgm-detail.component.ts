import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRQuestionMgm } from './gdpr-question-mgm.model';
import { GDPRQuestionMgmService } from './gdpr-question-mgm.service';

@Component({
    selector: 'jhi-gdpr-question-mgm-detail',
    templateUrl: './gdpr-question-mgm-detail.component.html'
})
export class GDPRQuestionMgmDetailComponent implements OnInit, OnDestroy {

    gDPRQuestion: GDPRQuestionMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private gDPRQuestionService: GDPRQuestionMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInGDPRQuestions();
    }

    load(id) {
        this.gDPRQuestionService.find(id)
            .subscribe((gDPRQuestionResponse: HttpResponse<GDPRQuestionMgm>) => {
                this.gDPRQuestion = gDPRQuestionResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInGDPRQuestions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'gDPRQuestionListModification',
            (response) => this.load(this.gDPRQuestion.id)
        );
    }
}
