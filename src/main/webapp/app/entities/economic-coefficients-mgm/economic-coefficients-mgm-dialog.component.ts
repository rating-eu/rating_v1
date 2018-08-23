import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EconomicCoefficientsMgm } from './economic-coefficients-mgm.model';
import { EconomicCoefficientsMgmPopupService } from './economic-coefficients-mgm-popup.service';
import { EconomicCoefficientsMgmService } from './economic-coefficients-mgm.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';

@Component({
    selector: 'jhi-economic-coefficients-mgm-dialog',
    templateUrl: './economic-coefficients-mgm-dialog.component.html'
})
export class EconomicCoefficientsMgmDialogComponent implements OnInit {

    economicCoefficients: EconomicCoefficientsMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private economicCoefficientsService: EconomicCoefficientsMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.selfAssessmentService
            .query({filter: 'economiccoefficients-is-null'})
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => {
                if (!this.economicCoefficients.selfAssessment || !this.economicCoefficients.selfAssessment.id) {
                    this.selfassessments = res.body;
                } else {
                    this.selfAssessmentService
                        .find(this.economicCoefficients.selfAssessment.id)
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
        if (this.economicCoefficients.id !== undefined) {
            this.subscribeToSaveResponse(
                this.economicCoefficientsService.update(this.economicCoefficients));
        } else {
            this.subscribeToSaveResponse(
                this.economicCoefficientsService.create(this.economicCoefficients));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<EconomicCoefficientsMgm>>) {
        result.subscribe((res: HttpResponse<EconomicCoefficientsMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: EconomicCoefficientsMgm) {
        this.eventManager.broadcast({ name: 'economicCoefficientsListModification', content: 'OK'});
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
    selector: 'jhi-economic-coefficients-mgm-popup',
    template: ''
})
export class EconomicCoefficientsMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private economicCoefficientsPopupService: EconomicCoefficientsMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.economicCoefficientsPopupService
                    .open(EconomicCoefficientsMgmDialogComponent as Component, params['id']);
            } else {
                this.economicCoefficientsPopupService
                    .open(EconomicCoefficientsMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
