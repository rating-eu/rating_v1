import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRMyAnswerMgm } from './gdpr-my-answer-mgm.model';
import { GDPRMyAnswerMgmService } from './gdpr-my-answer-mgm.service';

@Component({
    selector: 'jhi-gdpr-my-answer-mgm-detail',
    templateUrl: './gdpr-my-answer-mgm-detail.component.html'
})
export class GDPRMyAnswerMgmDetailComponent implements OnInit, OnDestroy {

    gDPRMyAnswer: GDPRMyAnswerMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private gDPRMyAnswerService: GDPRMyAnswerMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInGDPRMyAnswers();
    }

    load(id) {
        this.gDPRMyAnswerService.find(id)
            .subscribe((gDPRMyAnswerResponse: HttpResponse<GDPRMyAnswerMgm>) => {
                this.gDPRMyAnswer = gDPRMyAnswerResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInGDPRMyAnswers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'gDPRMyAnswerListModification',
            (response) => this.load(this.gDPRMyAnswer.id)
        );
    }
}
