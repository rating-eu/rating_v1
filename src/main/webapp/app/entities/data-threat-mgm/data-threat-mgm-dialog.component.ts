import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataThreatMgm } from './data-threat-mgm.model';
import { DataThreatMgmPopupService } from './data-threat-mgm-popup.service';
import { DataThreatMgmService } from './data-threat-mgm.service';
import { DataOperationMgm, DataOperationMgmService } from '../data-operation-mgm';
import { OverallDataThreatMgm, OverallDataThreatMgmService } from '../overall-data-threat-mgm';

@Component({
    selector: 'jhi-data-threat-mgm-dialog',
    templateUrl: './data-threat-mgm-dialog.component.html'
})
export class DataThreatMgmDialogComponent implements OnInit {

    dataThreat: DataThreatMgm;
    isSaving: boolean;

    dataoperations: DataOperationMgm[];

    overalldatathreats: OverallDataThreatMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private dataThreatService: DataThreatMgmService,
        private dataOperationService: DataOperationMgmService,
        private overallDataThreatService: OverallDataThreatMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.dataOperationService.query()
            .subscribe((res: HttpResponse<DataOperationMgm[]>) => { this.dataoperations = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.overallDataThreatService.query()
            .subscribe((res: HttpResponse<OverallDataThreatMgm[]>) => { this.overalldatathreats = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.dataThreat.id !== undefined) {
            this.subscribeToSaveResponse(
                this.dataThreatService.update(this.dataThreat));
        } else {
            this.subscribeToSaveResponse(
                this.dataThreatService.create(this.dataThreat));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<DataThreatMgm>>) {
        result.subscribe((res: HttpResponse<DataThreatMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: DataThreatMgm) {
        this.eventManager.broadcast({ name: 'dataThreatListModification', content: 'OK'});
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

    trackOverallDataThreatById(index: number, item: OverallDataThreatMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-data-threat-mgm-popup',
    template: ''
})
export class DataThreatMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataThreatPopupService: DataThreatMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.dataThreatPopupService
                    .open(DataThreatMgmDialogComponent as Component, params['id']);
            } else {
                this.dataThreatPopupService
                    .open(DataThreatMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
