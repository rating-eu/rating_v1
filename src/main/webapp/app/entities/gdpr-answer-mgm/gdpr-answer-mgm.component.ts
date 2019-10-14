import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GDPRAnswerMgm } from './gdpr-answer-mgm.model';
import { GDPRAnswerMgmService } from './gdpr-answer-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-gdpr-answer-mgm',
    templateUrl: './gdpr-answer-mgm.component.html'
})
export class GDPRAnswerMgmComponent implements OnInit, OnDestroy {
gDPRAnswers: GDPRAnswerMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private gDPRAnswerService: GDPRAnswerMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.gDPRAnswerService.query().subscribe(
            (res: HttpResponse<GDPRAnswerMgm[]>) => {
                this.gDPRAnswers = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInGDPRAnswers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: GDPRAnswerMgm) {
        return item.id;
    }
    registerChangeInGDPRAnswers() {
        this.eventSubscriber = this.eventManager.subscribe('gDPRAnswerListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
