import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionMgm } from './question-mgm.model';
import { QuestionMgmPopupService } from './question-mgm-popup.service';
import { QuestionMgmService } from './question-mgm.service';
import { AttackStrategyMgm, AttackStrategyMgmService } from '../attack-strategy-mgm';
import { AnswerMgm, AnswerMgmService } from '../answer-mgm';
import { QuestionnaireMgm, QuestionnaireMgmService } from '../questionnaire-mgm';
import { ThreatAgentMgm, ThreatAgentMgmService } from '../threat-agent-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-question-mgm-dialog',
    templateUrl: './question-mgm-dialog.component.html'
})
export class QuestionMgmDialogComponent implements OnInit {

    question: QuestionMgm;
    isSaving: boolean;

    attackstrategies: AttackStrategyMgm[];

    answers: AnswerMgm[];

    questionnaires: QuestionnaireMgm[];

    threatagents: ThreatAgentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private questionService: QuestionMgmService,
        private attackStrategyService: AttackStrategyMgmService,
        private answerService: AnswerMgmService,
        private questionnaireService: QuestionnaireMgmService,
        private threatAgentService: ThreatAgentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.attackStrategyService.query()
            .subscribe((res: HttpResponse<AttackStrategyMgm[]>) => { this.attackstrategies = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.answerService.query()
            .subscribe((res: HttpResponse<AnswerMgm[]>) => { this.answers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireService.query()
            .subscribe((res: HttpResponse<QuestionnaireMgm[]>) => { this.questionnaires = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.threatAgentService.query()
            .subscribe((res: HttpResponse<ThreatAgentMgm[]>) => { this.threatagents = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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
        this.eventManager.broadcast({ name: 'questionListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackAttackStrategyById(index: number, item: AttackStrategyMgm) {
        return item.id;
    }

    trackAnswerById(index: number, item: AnswerMgm) {
        return item.id;
    }

    trackQuestionnaireById(index: number, item: QuestionnaireMgm) {
        return item.id;
    }

    trackThreatAgentById(index: number, item: ThreatAgentMgm) {
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
    selector: 'jhi-question-mgm-popup',
    template: ''
})
export class QuestionMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionPopupService: QuestionMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.questionPopupService
                        .open(QuestionMgmDialogComponent as Component, params['id']);
                } else {
                    this.questionPopupService
                        .open(QuestionMgmDialogComponent as Component);
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
