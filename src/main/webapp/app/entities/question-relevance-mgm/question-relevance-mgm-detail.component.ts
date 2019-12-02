import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionRelevanceMgm } from './question-relevance-mgm.model';
import { QuestionRelevanceMgmService } from './question-relevance-mgm.service';

@Component({
    selector: 'jhi-question-relevance-mgm-detail',
    templateUrl: './question-relevance-mgm-detail.component.html'
})
export class QuestionRelevanceMgmDetailComponent implements OnInit, OnDestroy {

    questionRelevance: QuestionRelevanceMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private questionRelevanceService: QuestionRelevanceMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestionRelevances();
    }

    load(id) {
        this.questionRelevanceService.find(id)
            .subscribe((questionRelevanceResponse: HttpResponse<QuestionRelevanceMgm>) => {
                this.questionRelevance = questionRelevanceResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionRelevances() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionRelevanceListModification',
            (response) => this.load(this.questionRelevance.id)
        );
    }
}
