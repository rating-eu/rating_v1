import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { AnswerMgm } from './answer-mgm.model';
import { AnswerMgmService } from './answer-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-answer-mgm-detail',
    templateUrl: './answer-mgm-detail.component.html'
})
export class AnswerMgmDetailComponent implements OnInit, OnDestroy {

    answer: AnswerMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private answerService: AnswerMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAnswers();
    }

    load(id) {
        this.answerService.find(id)
            .subscribe((answerResponse: HttpResponse<AnswerMgm>) => {
                this.answer = answerResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAnswers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'answerListModification',
            (response) => this.load(this.answer.id)
        );
    }
}
