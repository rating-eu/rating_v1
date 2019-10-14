import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { GDPRQuestionnaireStatusMgm } from './gdpr-questionnaire-status-mgm.model';
import { GDPRQuestionnaireStatusMgmPopupService } from './gdpr-questionnaire-status-mgm-popup.service';
import { GDPRQuestionnaireStatusMgmService } from './gdpr-questionnaire-status-mgm.service';
import { DataOperationMgm, DataOperationMgmService } from '../data-operation-mgm';
import { GDPRQuestionnaireMgm, GDPRQuestionnaireMgmService } from '../gdpr-questionnaire-mgm';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-gdpr-questionnaire-status-mgm-dialog',
    templateUrl: './gdpr-questionnaire-status-mgm-dialog.component.html'
})
export class GDPRQuestionnaireStatusMgmDialogComponent implements OnInit {

    gDPRQuestionnaireStatus: GDPRQuestionnaireStatusMgm;
    isSaving: boolean;

    dataoperations: DataOperationMgm[];

    gdprquestionnaires: GDPRQuestionnaireMgm[];

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private gDPRQuestionnaireStatusService: GDPRQuestionnaireStatusMgmService,
        private dataOperationService: DataOperationMgmService,
        private gDPRQuestionnaireService: GDPRQuestionnaireMgmService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.dataOperationService.query()
            .subscribe((res: HttpResponse<DataOperationMgm[]>) => { this.dataoperations = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.gDPRQuestionnaireService.query()
            .subscribe((res: HttpResponse<GDPRQuestionnaireMgm[]>) => { this.gdprquestionnaires = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.gDPRQuestionnaireStatus.id !== undefined) {
            this.subscribeToSaveResponse(
                this.gDPRQuestionnaireStatusService.update(this.gDPRQuestionnaireStatus));
        } else {
            this.subscribeToSaveResponse(
                this.gDPRQuestionnaireStatusService.create(this.gDPRQuestionnaireStatus));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<GDPRQuestionnaireStatusMgm>>) {
        result.subscribe((res: HttpResponse<GDPRQuestionnaireStatusMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: GDPRQuestionnaireStatusMgm) {
        this.eventManager.broadcast({ name: 'gDPRQuestionnaireStatusListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackDataOperationById(index: number, item: DataOperationMgm) {
        return item.id;
    }

    trackGDPRQuestionnaireById(index: number, item: GDPRQuestionnaireMgm) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-gdpr-questionnaire-status-mgm-popup',
    template: ''
})
export class GDPRQuestionnaireStatusMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRQuestionnaireStatusPopupService: GDPRQuestionnaireStatusMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.gDPRQuestionnaireStatusPopupService
                    .open(GDPRQuestionnaireStatusMgmDialogComponent as Component, params['id']);
            } else {
                this.gDPRQuestionnaireStatusPopupService
                    .open(GDPRQuestionnaireStatusMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
