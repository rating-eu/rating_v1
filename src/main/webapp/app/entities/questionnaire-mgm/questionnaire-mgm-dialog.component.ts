import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionnaireMgm } from './questionnaire-mgm.model';
import { QuestionnaireMgmPopupService } from './questionnaire-mgm-popup.service';
import { QuestionnaireMgmService } from './questionnaire-mgm.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';

@Component({
    selector: 'jhi-questionnaire-mgm-dialog',
    templateUrl: './questionnaire-mgm-dialog.component.html'
})
export class QuestionnaireMgmDialogComponent implements OnInit {

    questionnaire: QuestionnaireMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private questionnaireService: QuestionnaireMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.selfAssessmentService.query()
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => { this.selfassessments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.questionnaire.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionnaireService.update(this.questionnaire));
        } else {
            this.subscribeToSaveResponse(
                this.questionnaireService.create(this.questionnaire));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionnaireMgm>>) {
        result.subscribe((res: HttpResponse<QuestionnaireMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionnaireMgm) {
        this.eventManager.broadcast({ name: 'questionnaireListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackSelfAssessmentById(index: number, item: SelfAssessmentMgm) {
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
    selector: 'jhi-questionnaire-mgm-popup',
    template: ''
})
export class QuestionnaireMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionnairePopupService: QuestionnaireMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.questionnairePopupService
                    .open(QuestionnaireMgmDialogComponent as Component, params['id']);
            } else {
                this.questionnairePopupService
                    .open(QuestionnaireMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
