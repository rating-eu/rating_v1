import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LikelihoodScaleMgm } from './likelihood-scale-mgm.model';
import { LikelihoodScaleMgmPopupService } from './likelihood-scale-mgm-popup.service';
import { LikelihoodScaleMgmService } from './likelihood-scale-mgm.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-likelihood-scale-mgm-dialog',
    templateUrl: './likelihood-scale-mgm-dialog.component.html'
})
export class LikelihoodScaleMgmDialogComponent implements OnInit {

    likelihoodScale: LikelihoodScaleMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private likelihoodScaleService: LikelihoodScaleMgmService,
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
        if (this.likelihoodScale.id !== undefined) {
            this.subscribeToSaveResponse(
                this.likelihoodScaleService.update(this.likelihoodScale));
        } else {
            this.subscribeToSaveResponse(
                this.likelihoodScaleService.create(this.likelihoodScale));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LikelihoodScaleMgm>>) {
        result.subscribe((res: HttpResponse<LikelihoodScaleMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LikelihoodScaleMgm) {
        this.eventManager.broadcast({ name: 'likelihoodScaleListModification', content: 'OK'});
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
}

@Component({
    selector: 'jhi-likelihood-scale-mgm-popup',
    template: ''
})
export class LikelihoodScaleMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private likelihoodScalePopupService: LikelihoodScaleMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if ( params['id'] ) {
                    this.likelihoodScalePopupService
                        .open(LikelihoodScaleMgmDialogComponent as Component, params['id']);
                } else {
                    this.likelihoodScalePopupService
                        .open(LikelihoodScaleMgmDialogComponent as Component);
                }
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
