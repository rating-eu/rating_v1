import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GDPRMyAnswerMgm } from './gdpr-my-answer-mgm.model';
import { GDPRMyAnswerMgmService } from './gdpr-my-answer-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-gdpr-my-answer-mgm',
    templateUrl: './gdpr-my-answer-mgm.component.html'
})
export class GDPRMyAnswerMgmComponent implements OnInit, OnDestroy {
gDPRMyAnswers: GDPRMyAnswerMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private gDPRMyAnswerService: GDPRMyAnswerMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.gDPRMyAnswerService.query().subscribe(
            (res: HttpResponse<GDPRMyAnswerMgm[]>) => {
                this.gDPRMyAnswers = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInGDPRMyAnswers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: GDPRMyAnswerMgm) {
        return item.id;
    }
    registerChangeInGDPRMyAnswers() {
        this.eventSubscriber = this.eventManager.subscribe('gDPRMyAnswerListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
