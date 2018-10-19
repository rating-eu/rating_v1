import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionnaireStatusMgm } from './questionnaire-status-mgm.model';
import { QuestionnaireStatusMgmService } from './questionnaire-status-mgm.service';
import { Principal } from '../../shared';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-questionnaire-status-mgm',
    templateUrl: './questionnaire-status-mgm.component.html'
})
export class QuestionnaireStatusMgmComponent implements OnInit, OnDestroy {
questionnaireStatuses: QuestionnaireStatusMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        public popUpService: PopUpService
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.questionnaireStatusService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<QuestionnaireStatusMgm[]>) => this.questionnaireStatuses = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.questionnaireStatusService.query().subscribe(
            (res: HttpResponse<QuestionnaireStatusMgm[]>) => {
                this.questionnaireStatuses = res.body;
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
        this.registerChangeInQuestionnaireStatuses();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: QuestionnaireStatusMgm) {
        return item.id;
    }
    registerChangeInQuestionnaireStatuses() {
        this.eventSubscriber = this.eventManager.subscribe('questionnaireStatusListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
