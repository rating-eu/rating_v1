import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GDPRQuestionMgm } from './gdpr-question-mgm.model';
import { GDPRQuestionMgmService } from './gdpr-question-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-gdpr-question-mgm',
    templateUrl: './gdpr-question-mgm.component.html'
})
export class GDPRQuestionMgmComponent implements OnInit, OnDestroy {
gDPRQuestions: GDPRQuestionMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private gDPRQuestionService: GDPRQuestionMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.gDPRQuestionService.query().subscribe(
            (res: HttpResponse<GDPRQuestionMgm[]>) => {
                this.gDPRQuestions = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInGDPRQuestions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: GDPRQuestionMgm) {
        return item.id;
    }
    registerChangeInGDPRQuestions() {
        this.eventSubscriber = this.eventManager.subscribe('gDPRQuestionListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
