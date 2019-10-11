import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataRiskLevelConfigMgm } from './data-risk-level-config-mgm.model';
import { DataRiskLevelConfigMgmPopupService } from './data-risk-level-config-mgm-popup.service';
import { DataRiskLevelConfigMgmService } from './data-risk-level-config-mgm.service';
import { DataOperationMgm, DataOperationMgmService } from '../data-operation-mgm';

@Component({
    selector: 'jhi-data-risk-level-config-mgm-dialog',
    templateUrl: './data-risk-level-config-mgm-dialog.component.html'
})
export class DataRiskLevelConfigMgmDialogComponent implements OnInit {

    dataRiskLevelConfig: DataRiskLevelConfigMgm;
    isSaving: boolean;

    dataoperations: DataOperationMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private dataRiskLevelConfigService: DataRiskLevelConfigMgmService,
        private dataOperationService: DataOperationMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.dataOperationService.query()
            .subscribe((res: HttpResponse<DataOperationMgm[]>) => { this.dataoperations = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.dataRiskLevelConfig.id !== undefined) {
            this.subscribeToSaveResponse(
                this.dataRiskLevelConfigService.update(this.dataRiskLevelConfig));
        } else {
            this.subscribeToSaveResponse(
                this.dataRiskLevelConfigService.create(this.dataRiskLevelConfig));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<DataRiskLevelConfigMgm>>) {
        result.subscribe((res: HttpResponse<DataRiskLevelConfigMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: DataRiskLevelConfigMgm) {
        this.eventManager.broadcast({ name: 'dataRiskLevelConfigListModification', content: 'OK'});
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
    selector: 'jhi-data-risk-level-config-mgm-popup',
    template: ''
})
export class DataRiskLevelConfigMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataRiskLevelConfigPopupService: DataRiskLevelConfigMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.dataRiskLevelConfigPopupService
                    .open(DataRiskLevelConfigMgmDialogComponent as Component, params['id']);
            } else {
                this.dataRiskLevelConfigPopupService
                    .open(DataRiskLevelConfigMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
