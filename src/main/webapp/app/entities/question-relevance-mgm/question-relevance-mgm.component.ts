import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionRelevanceMgm } from './question-relevance-mgm.model';
import { QuestionRelevanceMgmService } from './question-relevance-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-question-relevance-mgm',
    templateUrl: './question-relevance-mgm.component.html'
})
export class QuestionRelevanceMgmComponent implements OnInit, OnDestroy {
questionRelevances: QuestionRelevanceMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private questionRelevanceService: QuestionRelevanceMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.questionRelevanceService.query().subscribe(
            (res: HttpResponse<QuestionRelevanceMgm[]>) => {
                this.questionRelevances = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInQuestionRelevances();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: QuestionRelevanceMgm) {
        return item.id;
    }
    registerChangeInQuestionRelevances() {
        this.eventSubscriber = this.eventManager.subscribe('questionRelevanceListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
