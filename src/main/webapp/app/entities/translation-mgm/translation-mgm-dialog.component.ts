import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TranslationMgm } from './translation-mgm.model';
import { TranslationMgmPopupService } from './translation-mgm-popup.service';
import { TranslationMgmService } from './translation-mgm.service';
import { DataImpactDescriptionMgm, DataImpactDescriptionMgmService } from '../data-impact-description-mgm';
import { GDPRQuestionMgm, GDPRQuestionMgmService } from '../gdpr-question-mgm';

@Component({
    selector: 'jhi-translation-mgm-dialog',
    templateUrl: './translation-mgm-dialog.component.html'
})
export class TranslationMgmDialogComponent implements OnInit {

    translation: TranslationMgm;
    isSaving: boolean;

    dataimpactdescriptions: DataImpactDescriptionMgm[];

    gdprquestions: GDPRQuestionMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private translationService: TranslationMgmService,
        private dataImpactDescriptionService: DataImpactDescriptionMgmService,
        private gDPRQuestionService: GDPRQuestionMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.dataImpactDescriptionService.query()
            .subscribe((res: HttpResponse<DataImpactDescriptionMgm[]>) => { this.dataimpactdescriptions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.gDPRQuestionService.query()
            .subscribe((res: HttpResponse<GDPRQuestionMgm[]>) => { this.gdprquestions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.translation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.translationService.update(this.translation));
        } else {
            this.subscribeToSaveResponse(
                this.translationService.create(this.translation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<TranslationMgm>>) {
        result.subscribe((res: HttpResponse<TranslationMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: TranslationMgm) {
        this.eventManager.broadcast({ name: 'translationListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackDataImpactDescriptionById(index: number, item: DataImpactDescriptionMgm) {
        return item.id;
    }

    trackGDPRQuestionById(index: number, item: GDPRQuestionMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-translation-mgm-popup',
    template: ''
})
export class TranslationMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private translationPopupService: TranslationMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.translationPopupService
                    .open(TranslationMgmDialogComponent as Component, params['id']);
            } else {
                this.translationPopupService
                    .open(TranslationMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
