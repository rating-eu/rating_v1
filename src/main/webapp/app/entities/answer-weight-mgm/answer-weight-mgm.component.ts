import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {AnswerWeightMgm} from './answer-weight-mgm.model';
import {AnswerWeightMgmService} from './answer-weight-mgm.service';
import {Principal} from '../../shared';
import {MatTabChangeEvent} from '@angular/material';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-answer-weight-mgm',
    templateUrl: './answer-weight-mgm.component.html'
})
export class AnswerWeightMgmComponent implements OnInit, OnDestroy {
    answerWeights: AnswerWeightMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(private answerWeightService: AnswerWeightMgmService,
                private jhiAlertService: JhiAlertService,
                private eventManager: JhiEventManager,
                private activatedRoute: ActivatedRoute,
                private principal: Principal,
                private popUpService: PopUpService) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.answerWeightService.search({
                query: this.currentSearch,
            }).subscribe(
                (res: HttpResponse<AnswerWeightMgm[]>) => this.answerWeights = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
            return;
        }
        this.answerWeightService.query().subscribe(
            (res: HttpResponse<AnswerWeightMgm[]>) => {
                this.answerWeights = res.body;
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
        this.registerChangeInAnswerWeights();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AnswerWeightMgm) {
        return item.id;
    }

    registerChangeInAnswerWeights() {
        this.eventSubscriber = this.eventManager.subscribe('answerWeightListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    tabClick(event: MatTabChangeEvent) {
        console.log('Tab clicked...');
        console.log(event.tab.textLabel);

        this.currentSearch = event.tab.textLabel;
        this.search(this.currentSearch);
    }
}
