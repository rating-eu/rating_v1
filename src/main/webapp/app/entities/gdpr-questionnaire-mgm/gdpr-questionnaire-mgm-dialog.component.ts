import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRQuestionnaireMgm } from './gdpr-questionnaire-mgm.model';
import { GDPRQuestionnaireMgmPopupService } from './gdpr-questionnaire-mgm-popup.service';
import { GDPRQuestionnaireMgmService } from './gdpr-questionnaire-mgm.service';

@Component({
    selector: 'jhi-gdpr-questionnaire-mgm-dialog',
    templateUrl: './gdpr-questionnaire-mgm-dialog.component.html'
})
export class GDPRQuestionnaireMgmDialogComponent implements OnInit {

    gDPRQuestionnaire: GDPRQuestionnaireMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private gDPRQuestionnaireService: GDPRQuestionnaireMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.gDPRQuestionnaire.id !== undefined) {
            this.subscribeToSaveResponse(
                this.gDPRQuestionnaireService.update(this.gDPRQuestionnaire));
        } else {
            this.subscribeToSaveResponse(
                this.gDPRQuestionnaireService.create(this.gDPRQuestionnaire));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<GDPRQuestionnaireMgm>>) {
        result.subscribe((res: HttpResponse<GDPRQuestionnaireMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: GDPRQuestionnaireMgm) {
        this.eventManager.broadcast({ name: 'gDPRQuestionnaireListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-gdpr-questionnaire-mgm-popup',
    template: ''
})
export class GDPRQuestionnaireMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRQuestionnairePopupService: GDPRQuestionnaireMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.gDPRQuestionnairePopupService
                    .open(GDPRQuestionnaireMgmDialogComponent as Component, params['id']);
            } else {
                this.gDPRQuestionnairePopupService
                    .open(GDPRQuestionnaireMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
