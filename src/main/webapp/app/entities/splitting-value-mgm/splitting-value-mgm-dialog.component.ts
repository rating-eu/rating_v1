import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SplittingValueMgm } from './splitting-value-mgm.model';
import { SplittingValueMgmPopupService } from './splitting-value-mgm-popup.service';
import { SplittingValueMgmService } from './splitting-value-mgm.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';

@Component({
    selector: 'jhi-splitting-value-mgm-dialog',
    templateUrl: './splitting-value-mgm-dialog.component.html'
})
export class SplittingValueMgmDialogComponent implements OnInit {

    splittingValue: SplittingValueMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private splittingValueService: SplittingValueMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.selfAssessmentService
            .query({filter: 'splittingvalue-is-null'})
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => {
                if (!this.splittingValue.selfAssessment || !this.splittingValue.selfAssessment.id) {
                    this.selfassessments = res.body;
                } else {
                    this.selfAssessmentService
                        .find(this.splittingValue.selfAssessment.id)
                        .subscribe((subRes: HttpResponse<SelfAssessmentMgm>) => {
                            this.selfassessments = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.splittingValue.id !== undefined) {
            this.subscribeToSaveResponse(
                this.splittingValueService.update(this.splittingValue));
        } else {
            this.subscribeToSaveResponse(
                this.splittingValueService.create(this.splittingValue));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SplittingValueMgm>>) {
        result.subscribe((res: HttpResponse<SplittingValueMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SplittingValueMgm) {
        this.eventManager.broadcast({ name: 'splittingValueListModification', content: 'OK'});
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
    selector: 'jhi-splitting-value-mgm-popup',
    template: ''
})
export class SplittingValueMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private splittingValuePopupService: SplittingValueMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.splittingValuePopupService
                    .open(SplittingValueMgmDialogComponent as Component, params['id']);
            } else {
                this.splittingValuePopupService
                    .open(SplittingValueMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
