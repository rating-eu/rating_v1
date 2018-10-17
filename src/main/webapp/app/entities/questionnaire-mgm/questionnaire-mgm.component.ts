import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionnaireMgm } from './questionnaire-mgm.model';
import { QuestionnaireMgmService } from './questionnaire-mgm.service';
import { Principal } from '../../shared';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-questionnaire-mgm',
    templateUrl: './questionnaire-mgm.component.html'
})
export class QuestionnaireMgmComponent implements OnInit, OnDestroy {
questionnaires: QuestionnaireMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private questionnaireService: QuestionnaireMgmService,
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
            this.questionnaireService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<QuestionnaireMgm[]>) => this.questionnaires = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.questionnaireService.query().subscribe(
            (res: HttpResponse<QuestionnaireMgm[]>) => {
                this.questionnaires = res.body;
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
        this.registerChangeInQuestionnaires();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: QuestionnaireMgm) {
        return item.id;
    }
    registerChangeInQuestionnaires() {
        this.eventSubscriber = this.eventManager.subscribe('questionnaireListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
