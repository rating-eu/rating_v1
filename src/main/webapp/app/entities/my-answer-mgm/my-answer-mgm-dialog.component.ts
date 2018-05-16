import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MyAnswerMgm } from './my-answer-mgm.model';
import { MyAnswerMgmPopupService } from './my-answer-mgm-popup.service';
import { MyAnswerMgmService } from './my-answer-mgm.service';
import { QuestionnaireStatusMgm, QuestionnaireStatusMgmService } from '../questionnaire-status-mgm';
import { AnswerMgm, AnswerMgmService } from '../answer-mgm';
import { QuestionMgm, QuestionMgmService } from '../question-mgm';
import { QuestionnaireMgm, QuestionnaireMgmService } from '../questionnaire-mgm';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-my-answer-mgm-dialog',
    templateUrl: './my-answer-mgm-dialog.component.html'
})
export class MyAnswerMgmDialogComponent implements OnInit {

    myAnswer: MyAnswerMgm;
    isSaving: boolean;

    questionnairestatuses: QuestionnaireStatusMgm[];

    answers: AnswerMgm[];

    questions: QuestionMgm[];

    questionnaires: QuestionnaireMgm[];

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private myAnswerService: MyAnswerMgmService,
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        private answerService: AnswerMgmService,
        private questionService: QuestionMgmService,
        private questionnaireService: QuestionnaireMgmService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.questionnaireStatusService.query()
            .subscribe((res: HttpResponse<QuestionnaireStatusMgm[]>) => { this.questionnairestatuses = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.answerService
            .query({filter: 'myanswer-is-null'})
            .subscribe((res: HttpResponse<AnswerMgm[]>) => {
                if (!this.myAnswer.answer || !this.myAnswer.answer.id) {
                    this.answers = res.body;
                } else {
                    this.answerService
                        .find(this.myAnswer.answer.id)
                        .subscribe((subRes: HttpResponse<AnswerMgm>) => {
                            this.answers = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionService
            .query({filter: 'myanswer-is-null'})
            .subscribe((res: HttpResponse<QuestionMgm[]>) => {
                if (!this.myAnswer.question || !this.myAnswer.question.id) {
                    this.questions = res.body;
                } else {
                    this.questionService
                        .find(this.myAnswer.question.id)
                        .subscribe((subRes: HttpResponse<QuestionMgm>) => {
                            this.questions = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireService
            .query({filter: 'myanswer-is-null'})
            .subscribe((res: HttpResponse<QuestionnaireMgm[]>) => {
                if (!this.myAnswer.questionnaire || !this.myAnswer.questionnaire.id) {
                    this.questionnaires = res.body;
                } else {
                    this.questionnaireService
                        .find(this.myAnswer.questionnaire.id)
                        .subscribe((subRes: HttpResponse<QuestionnaireMgm>) => {
                            this.questionnaires = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.myAnswer.id !== undefined) {
            this.subscribeToSaveResponse(
                this.myAnswerService.update(this.myAnswer));
        } else {
            this.subscribeToSaveResponse(
                this.myAnswerService.create(this.myAnswer));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MyAnswerMgm>>) {
        result.subscribe((res: HttpResponse<MyAnswerMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MyAnswerMgm) {
        this.eventManager.broadcast({ name: 'myAnswerListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackQuestionnaireStatusById(index: number, item: QuestionnaireStatusMgm) {
        return item.id;
    }

    trackAnswerById(index: number, item: AnswerMgm) {
        return item.id;
    }

    trackQuestionById(index: number, item: QuestionMgm) {
        return item.id;
    }

    trackQuestionnaireById(index: number, item: QuestionnaireMgm) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-my-answer-mgm-popup',
    template: ''
})
export class MyAnswerMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myAnswerPopupService: MyAnswerMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.myAnswerPopupService
                    .open(MyAnswerMgmDialogComponent as Component, params['id']);
            } else {
                this.myAnswerPopupService
                    .open(MyAnswerMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
