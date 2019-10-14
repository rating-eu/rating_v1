import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OverallDataThreatMgm } from './overall-data-threat-mgm.model';
import { OverallDataThreatMgmPopupService } from './overall-data-threat-mgm-popup.service';
import { OverallDataThreatMgmService } from './overall-data-threat-mgm.service';
import { DataOperationMgm, DataOperationMgmService } from '../data-operation-mgm';

@Component({
    selector: 'jhi-overall-data-threat-mgm-dialog',
    templateUrl: './overall-data-threat-mgm-dialog.component.html'
})
export class OverallDataThreatMgmDialogComponent implements OnInit {

    overallDataThreat: OverallDataThreatMgm;
    isSaving: boolean;

    operations: DataOperationMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private overallDataThreatService: OverallDataThreatMgmService,
        private dataOperationService: DataOperationMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.dataOperationService
            .query({filter: 'overalldatathreat-is-null'})
            .subscribe((res: HttpResponse<DataOperationMgm[]>) => {
                if (!this.overallDataThreat.operation || !this.overallDataThreat.operation.id) {
                    this.operations = res.body;
                } else {
                    this.dataOperationService
                        .find(this.overallDataThreat.operation.id)
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
        if (this.overallDataThreat.id !== undefined) {
            this.subscribeToSaveResponse(
                this.overallDataThreatService.update(this.overallDataThreat));
        } else {
            this.subscribeToSaveResponse(
                this.overallDataThreatService.create(this.overallDataThreat));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<OverallDataThreatMgm>>) {
        result.subscribe((res: HttpResponse<OverallDataThreatMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: OverallDataThreatMgm) {
        this.eventManager.broadcast({ name: 'overallDataThreatListModification', content: 'OK'});
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
    selector: 'jhi-overall-data-threat-mgm-popup',
    template: ''
})
export class OverallDataThreatMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private overallDataThreatPopupService: OverallDataThreatMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.overallDataThreatPopupService
                    .open(OverallDataThreatMgmDialogComponent as Component, params['id']);
            } else {
                this.overallDataThreatPopupService
                    .open(OverallDataThreatMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
