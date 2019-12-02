import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionRelevanceMgm } from './question-relevance-mgm.model';
import { QuestionRelevanceMgmPopupService } from './question-relevance-mgm-popup.service';
import { QuestionRelevanceMgmService } from './question-relevance-mgm.service';
import { QuestionMgm, QuestionMgmService } from '../question-mgm';
import { QuestionnaireStatusMgm, QuestionnaireStatusMgmService } from '../questionnaire-status-mgm';

@Component({
    selector: 'jhi-question-relevance-mgm-dialog',
    templateUrl: './question-relevance-mgm-dialog.component.html'
})
export class QuestionRelevanceMgmDialogComponent implements OnInit {

    questionRelevance: QuestionRelevanceMgm;
    isSaving: boolean;

    questions: QuestionMgm[];

    questionnairestatuses: QuestionnaireStatusMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private questionRelevanceService: QuestionRelevanceMgmService,
        private questionService: QuestionMgmService,
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.questionService.query()
            .subscribe((res: HttpResponse<QuestionMgm[]>) => { this.questions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireStatusService.query()
            .subscribe((res: HttpResponse<QuestionnaireStatusMgm[]>) => { this.questionnairestatuses = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.questionRelevance.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionRelevanceService.update(this.questionRelevance));
        } else {
            this.subscribeToSaveResponse(
                this.questionRelevanceService.create(this.questionRelevance));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionRelevanceMgm>>) {
        result.subscribe((res: HttpResponse<QuestionRelevanceMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionRelevanceMgm) {
        this.eventManager.broadcast({ name: 'questionRelevanceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackQuestionById(index: number, item: QuestionMgm) {
        return item.id;
    }

    trackQuestionnaireStatusById(index: number, item: QuestionnaireStatusMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-question-relevance-mgm-popup',
    template: ''
})
export class QuestionRelevanceMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionRelevancePopupService: QuestionRelevanceMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.questionRelevancePopupService
                    .open(QuestionRelevanceMgmDialogComponent as Component, params['id']);
            } else {
                this.questionRelevancePopupService
                    .open(QuestionRelevanceMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
