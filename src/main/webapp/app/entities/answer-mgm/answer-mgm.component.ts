import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AnswerMgm } from './answer-mgm.model';
import { AnswerMgmService } from './answer-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-answer-mgm',
    templateUrl: './answer-mgm.component.html'
})
export class AnswerMgmComponent implements OnInit, OnDestroy {
answers: AnswerMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private answerService: AnswerMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.answerService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<AnswerMgm[]>) => this.answers = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.answerService.query().subscribe(
            (res: HttpResponse<AnswerMgm[]>) => {
                this.answers = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInAnswers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AnswerMgm) {
        return item.id;
    }
    registerChangeInAnswers() {
        this.eventSubscriber = this.eventManager.subscribe('answerListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
