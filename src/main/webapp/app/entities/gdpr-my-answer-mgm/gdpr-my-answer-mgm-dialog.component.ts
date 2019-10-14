import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GDPRMyAnswerMgm } from './gdpr-my-answer-mgm.model';
import { GDPRMyAnswerMgmPopupService } from './gdpr-my-answer-mgm-popup.service';
import { GDPRMyAnswerMgmService } from './gdpr-my-answer-mgm.service';
import { GDPRQuestionnaireStatusMgm, GDPRQuestionnaireStatusMgmService } from '../gdpr-questionnaire-status-mgm';
import { GDPRQuestionMgm, GDPRQuestionMgmService } from '../gdpr-question-mgm';
import { GDPRAnswerMgm, GDPRAnswerMgmService } from '../gdpr-answer-mgm';

@Component({
    selector: 'jhi-gdpr-my-answer-mgm-dialog',
    templateUrl: './gdpr-my-answer-mgm-dialog.component.html'
})
export class GDPRMyAnswerMgmDialogComponent implements OnInit {

    gDPRMyAnswer: GDPRMyAnswerMgm;
    isSaving: boolean;

    gdprquestionnairestatuses: GDPRQuestionnaireStatusMgm[];

    gdprquestions: GDPRQuestionMgm[];

    gdpranswers: GDPRAnswerMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private gDPRMyAnswerService: GDPRMyAnswerMgmService,
        private gDPRQuestionnaireStatusService: GDPRQuestionnaireStatusMgmService,
        private gDPRQuestionService: GDPRQuestionMgmService,
        private gDPRAnswerService: GDPRAnswerMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.gDPRQuestionnaireStatusService.query()
            .subscribe((res: HttpResponse<GDPRQuestionnaireStatusMgm[]>) => { this.gdprquestionnairestatuses = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.gDPRQuestionService.query()
            .subscribe((res: HttpResponse<GDPRQuestionMgm[]>) => { this.gdprquestions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.gDPRAnswerService.query()
            .subscribe((res: HttpResponse<GDPRAnswerMgm[]>) => { this.gdpranswers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.gDPRMyAnswer.id !== undefined) {
            this.subscribeToSaveResponse(
                this.gDPRMyAnswerService.update(this.gDPRMyAnswer));
        } else {
            this.subscribeToSaveResponse(
                this.gDPRMyAnswerService.create(this.gDPRMyAnswer));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<GDPRMyAnswerMgm>>) {
        result.subscribe((res: HttpResponse<GDPRMyAnswerMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: GDPRMyAnswerMgm) {
        this.eventManager.broadcast({ name: 'gDPRMyAnswerListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackGDPRQuestionnaireStatusById(index: number, item: GDPRQuestionnaireStatusMgm) {
        return item.id;
    }

    trackGDPRQuestionById(index: number, item: GDPRQuestionMgm) {
        return item.id;
    }

    trackGDPRAnswerById(index: number, item: GDPRAnswerMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-gdpr-my-answer-mgm-popup',
    template: ''
})
export class GDPRMyAnswerMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRMyAnswerPopupService: GDPRMyAnswerMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.gDPRMyAnswerPopupService
                    .open(GDPRMyAnswerMgmDialogComponent as Component, params['id']);
            } else {
                this.gDPRMyAnswerPopupService
                    .open(GDPRMyAnswerMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
