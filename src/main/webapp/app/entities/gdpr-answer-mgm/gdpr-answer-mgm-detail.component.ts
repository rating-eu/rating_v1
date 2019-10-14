import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRAnswerMgm } from './gdpr-answer-mgm.model';
import { GDPRAnswerMgmService } from './gdpr-answer-mgm.service';

@Component({
    selector: 'jhi-gdpr-answer-mgm-detail',
    templateUrl: './gdpr-answer-mgm-detail.component.html'
})
export class GDPRAnswerMgmDetailComponent implements OnInit, OnDestroy {

    gDPRAnswer: GDPRAnswerMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private gDPRAnswerService: GDPRAnswerMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInGDPRAnswers();
    }

    load(id) {
        this.gDPRAnswerService.find(id)
            .subscribe((gDPRAnswerResponse: HttpResponse<GDPRAnswerMgm>) => {
                this.gDPRAnswer = gDPRAnswerResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInGDPRAnswers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'gDPRAnswerListModification',
            (response) => this.load(this.gDPRAnswer.id)
        );
    }
}
