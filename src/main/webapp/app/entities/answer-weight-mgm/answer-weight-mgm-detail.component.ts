import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { AnswerWeightMgm } from './answer-weight-mgm.model';
import { AnswerWeightMgmService } from './answer-weight-mgm.service';

@Component({
    selector: 'jhi-answer-weight-mgm-detail',
    templateUrl: './answer-weight-mgm-detail.component.html'
})
export class AnswerWeightMgmDetailComponent implements OnInit, OnDestroy {

    answerWeight: AnswerWeightMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private answerWeightService: AnswerWeightMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAnswerWeights();
    }

    load(id) {
        this.answerWeightService.find(id)
            .subscribe((answerWeightResponse: HttpResponse<AnswerWeightMgm>) => {
                this.answerWeight = answerWeightResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAnswerWeights() {
        this.eventSubscriber = this.eventManager.subscribe(
            'answerWeightListModification',
            (response) => this.load(this.answerWeight.id)
        );
    }
}
