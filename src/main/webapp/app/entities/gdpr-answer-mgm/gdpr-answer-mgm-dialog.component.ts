import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GDPRAnswerMgm } from './gdpr-answer-mgm.model';
import { GDPRAnswerMgmPopupService } from './gdpr-answer-mgm-popup.service';
import { GDPRAnswerMgmService } from './gdpr-answer-mgm.service';
import { GDPRQuestionMgm, GDPRQuestionMgmService } from '../gdpr-question-mgm';

@Component({
    selector: 'jhi-gdpr-answer-mgm-dialog',
    templateUrl: './gdpr-answer-mgm-dialog.component.html'
})
export class GDPRAnswerMgmDialogComponent implements OnInit {

    gDPRAnswer: GDPRAnswerMgm;
    isSaving: boolean;

    gdprquestions: GDPRQuestionMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private gDPRAnswerService: GDPRAnswerMgmService,
        private gDPRQuestionService: GDPRQuestionMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.gDPRQuestionService.query()
            .subscribe((res: HttpResponse<GDPRQuestionMgm[]>) => { this.gdprquestions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.gDPRAnswer.id !== undefined) {
            this.subscribeToSaveResponse(
                this.gDPRAnswerService.update(this.gDPRAnswer));
        } else {
            this.subscribeToSaveResponse(
                this.gDPRAnswerService.create(this.gDPRAnswer));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<GDPRAnswerMgm>>) {
        result.subscribe((res: HttpResponse<GDPRAnswerMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: GDPRAnswerMgm) {
        this.eventManager.broadcast({ name: 'gDPRAnswerListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackGDPRQuestionById(index: number, item: GDPRQuestionMgm) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-gdpr-answer-mgm-popup',
    template: ''
})
export class GDPRAnswerMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRAnswerPopupService: GDPRAnswerMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.gDPRAnswerPopupService
                    .open(GDPRAnswerMgmDialogComponent as Component, params['id']);
            } else {
                this.gDPRAnswerPopupService
                    .open(GDPRAnswerMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
