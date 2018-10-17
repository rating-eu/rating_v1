import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EconomicResultsMgm } from './economic-results-mgm.model';
import { EconomicResultsMgmPopupService } from './economic-results-mgm-popup.service';
import { EconomicResultsMgmService } from './economic-results-mgm.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-economic-results-mgm-dialog',
    templateUrl: './economic-results-mgm-dialog.component.html'
})
export class EconomicResultsMgmDialogComponent implements OnInit {

    economicResults: EconomicResultsMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private economicResultsService: EconomicResultsMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.selfAssessmentService
            .query({ filter: 'economicresults-is-null' })
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => {
                if (!this.economicResults.selfAssessment || !this.economicResults.selfAssessment.id) {
                    this.selfassessments = res.body;
                } else {
                    this.selfAssessmentService
                        .find(this.economicResults.selfAssessment.id)
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
        if (this.economicResults.id !== undefined) {
            this.subscribeToSaveResponse(
                this.economicResultsService.update(this.economicResults));
        } else {
            this.subscribeToSaveResponse(
                this.economicResultsService.create(this.economicResults));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<EconomicResultsMgm>>) {
        result.subscribe((res: HttpResponse<EconomicResultsMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: EconomicResultsMgm) {
        this.eventManager.broadcast({ name: 'economicResultsListModification', content: 'OK' });
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
    selector: 'jhi-economic-results-mgm-popup',
    template: ''
})
export class EconomicResultsMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private economicResultsPopupService: EconomicResultsMgmPopupService,
        private popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.economicResultsPopupService
                        .open(EconomicResultsMgmDialogComponent as Component, params['id']);
                } else {
                    this.economicResultsPopupService
                        .open(EconomicResultsMgmDialogComponent as Component);
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
