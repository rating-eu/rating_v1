import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GDPRQuestionnaireStatusMgm } from './gdpr-questionnaire-status-mgm.model';
import { GDPRQuestionnaireStatusMgmService } from './gdpr-questionnaire-status-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-gdpr-questionnaire-status-mgm',
    templateUrl: './gdpr-questionnaire-status-mgm.component.html'
})
export class GDPRQuestionnaireStatusMgmComponent implements OnInit, OnDestroy {
gDPRQuestionnaireStatuses: GDPRQuestionnaireStatusMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private gDPRQuestionnaireStatusService: GDPRQuestionnaireStatusMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.gDPRQuestionnaireStatusService.query().subscribe(
            (res: HttpResponse<GDPRQuestionnaireStatusMgm[]>) => {
                this.gDPRQuestionnaireStatuses = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInGDPRQuestionnaireStatuses();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: GDPRQuestionnaireStatusMgm) {
        return item.id;
    }
    registerChangeInGDPRQuestionnaireStatuses() {
        this.eventSubscriber = this.eventManager.subscribe('gDPRQuestionnaireStatusListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
