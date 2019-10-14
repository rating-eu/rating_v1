import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GDPRQuestionnaireMgm } from './gdpr-questionnaire-mgm.model';
import { GDPRQuestionnaireMgmService } from './gdpr-questionnaire-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-gdpr-questionnaire-mgm',
    templateUrl: './gdpr-questionnaire-mgm.component.html'
})
export class GDPRQuestionnaireMgmComponent implements OnInit, OnDestroy {
gDPRQuestionnaires: GDPRQuestionnaireMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private gDPRQuestionnaireService: GDPRQuestionnaireMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.gDPRQuestionnaireService.query().subscribe(
            (res: HttpResponse<GDPRQuestionnaireMgm[]>) => {
                this.gDPRQuestionnaires = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInGDPRQuestionnaires();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: GDPRQuestionnaireMgm) {
        return item.id;
    }
    registerChangeInGDPRQuestionnaires() {
        this.eventSubscriber = this.eventManager.subscribe('gDPRQuestionnaireListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
