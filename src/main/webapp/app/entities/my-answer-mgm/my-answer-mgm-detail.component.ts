import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyAnswerMgm } from './my-answer-mgm.model';
import { MyAnswerMgmService } from './my-answer-mgm.service';

@Component({
    selector: 'jhi-my-answer-mgm-detail',
    templateUrl: './my-answer-mgm-detail.component.html'
})
export class MyAnswerMgmDetailComponent implements OnInit, OnDestroy {

    myAnswer: MyAnswerMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private myAnswerService: MyAnswerMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMyAnswers();
    }

    load(id) {
        this.myAnswerService.find(id)
            .subscribe((myAnswerResponse: HttpResponse<MyAnswerMgm>) => {
                this.myAnswer = myAnswerResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMyAnswers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'myAnswerListModification',
            (response) => this.load(this.myAnswer.id)
        );
    }
}
