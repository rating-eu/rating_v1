import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GDPRQuestionMgm } from './gdpr-question-mgm.model';
import { GDPRQuestionMgmPopupService } from './gdpr-question-mgm-popup.service';
import { GDPRQuestionMgmService } from './gdpr-question-mgm.service';
import { GDPRQuestionnaireMgm, GDPRQuestionnaireMgmService } from '../gdpr-questionnaire-mgm';
import { GDPRAnswerMgm, GDPRAnswerMgmService } from '../gdpr-answer-mgm';

@Component({
    selector: 'jhi-gdpr-question-mgm-dialog',
    templateUrl: './gdpr-question-mgm-dialog.component.html'
})
export class GDPRQuestionMgmDialogComponent implements OnInit {

    gDPRQuestion: GDPRQuestionMgm;
    isSaving: boolean;

    gdprquestionnaires: GDPRQuestionnaireMgm[];

    gdpranswers: GDPRAnswerMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private gDPRQuestionService: GDPRQuestionMgmService,
        private gDPRQuestionnaireService: GDPRQuestionnaireMgmService,
        private gDPRAnswerService: GDPRAnswerMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.gDPRQuestionnaireService.query()
            .subscribe((res: HttpResponse<GDPRQuestionnaireMgm[]>) => { this.gdprquestionnaires = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.gDPRAnswerService.query()
            .subscribe((res: HttpResponse<GDPRAnswerMgm[]>) => { this.gdpranswers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.gDPRQuestion.id !== undefined) {
            this.subscribeToSaveResponse(
                this.gDPRQuestionService.update(this.gDPRQuestion));
        } else {
            this.subscribeToSaveResponse(
                this.gDPRQuestionService.create(this.gDPRQuestion));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<GDPRQuestionMgm>>) {
        result.subscribe((res: HttpResponse<GDPRQuestionMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: GDPRQuestionMgm) {
        this.eventManager.broadcast({ name: 'gDPRQuestionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackGDPRQuestionnaireById(index: number, item: GDPRQuestionnaireMgm) {
        return item.id;
    }

    trackGDPRAnswerById(index: number, item: GDPRAnswerMgm) {
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
    selector: 'jhi-gdpr-question-mgm-popup',
    template: ''
})
export class GDPRQuestionMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRQuestionPopupService: GDPRQuestionMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.gDPRQuestionPopupService
                    .open(GDPRQuestionMgmDialogComponent as Component, params['id']);
            } else {
                this.gDPRQuestionPopupService
                    .open(GDPRQuestionMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
