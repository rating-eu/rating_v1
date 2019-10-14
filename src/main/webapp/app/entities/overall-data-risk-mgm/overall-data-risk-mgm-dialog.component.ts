import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OverallDataRiskMgm } from './overall-data-risk-mgm.model';
import { OverallDataRiskMgmPopupService } from './overall-data-risk-mgm-popup.service';
import { OverallDataRiskMgmService } from './overall-data-risk-mgm.service';
import { DataOperationMgm, DataOperationMgmService } from '../data-operation-mgm';

@Component({
    selector: 'jhi-overall-data-risk-mgm-dialog',
    templateUrl: './overall-data-risk-mgm-dialog.component.html'
})
export class OverallDataRiskMgmDialogComponent implements OnInit {

    overallDataRisk: OverallDataRiskMgm;
    isSaving: boolean;

    operations: DataOperationMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private overallDataRiskService: OverallDataRiskMgmService,
        private dataOperationService: DataOperationMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.dataOperationService
            .query({filter: 'overalldatarisk-is-null'})
            .subscribe((res: HttpResponse<DataOperationMgm[]>) => {
                if (!this.overallDataRisk.operation || !this.overallDataRisk.operation.id) {
                    this.operations = res.body;
                } else {
                    this.dataOperationService
                        .find(this.overallDataRisk.operation.id)
                        .subscribe((subRes: HttpResponse<DataOperationMgm>) => {
                            this.operations = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.overallDataRisk.id !== undefined) {
            this.subscribeToSaveResponse(
                this.overallDataRiskService.update(this.overallDataRisk));
        } else {
            this.subscribeToSaveResponse(
                this.overallDataRiskService.create(this.overallDataRisk));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<OverallDataRiskMgm>>) {
        result.subscribe((res: HttpResponse<OverallDataRiskMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: OverallDataRiskMgm) {
        this.eventManager.broadcast({ name: 'overallDataRiskListModification', content: 'OK'});
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
}

@Component({
    selector: 'jhi-overall-data-risk-mgm-popup',
    template: ''
})
export class OverallDataRiskMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private overallDataRiskPopupService: OverallDataRiskMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.overallDataRiskPopupService
                    .open(OverallDataRiskMgmDialogComponent as Component, params['id']);
            } else {
                this.overallDataRiskPopupService
                    .open(OverallDataRiskMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
