import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionMgm } from './question-mgm.model';
import { QuestionMgmPopupService } from './question-mgm-popup.service';
import { QuestionMgmService } from './question-mgm.service';
import { MyAnswerMgm, MyAnswerMgmService } from '../my-answer-mgm';
import { QuestionnaireMgm, QuestionnaireMgmService } from '../questionnaire-mgm';

@Component({
    selector: 'jhi-question-mgm-dialog',
    templateUrl: './question-mgm-dialog.component.html'
})
export class QuestionMgmDialogComponent implements OnInit {

    question: QuestionMgm;
    isSaving: boolean;

    myanswers: MyAnswerMgm[];

    questionnaires: QuestionnaireMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private questionService: QuestionMgmService,
        private myAnswerService: MyAnswerMgmService,
        private questionnaireService: QuestionnaireMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.myAnswerService.query()
            .subscribe((res: HttpResponse<MyAnswerMgm[]>) => { this.myanswers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireService.query()
            .subscribe((res: HttpResponse<QuestionnaireMgm[]>) => { this.questionnaires = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.question.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionService.update(this.question));
        } else {
            this.subscribeToSaveResponse(
                this.questionService.create(this.question));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionMgm>>) {
        result.subscribe((res: HttpResponse<QuestionMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionMgm) {
        this.eventManager.broadcast({ name: 'questionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackMyAnswerById(index: number, item: MyAnswerMgm) {
        return item.id;
    }

    trackQuestionnaireById(index: number, item: QuestionnaireMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-question-mgm-popup',
    template: ''
})
export class QuestionMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionPopupService: QuestionMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.questionPopupService
                    .open(QuestionMgmDialogComponent as Component, params['id']);
            } else {
                this.questionPopupService
                    .open(QuestionMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
