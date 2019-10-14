import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataRecipientMgm } from './data-recipient-mgm.model';
import { DataRecipientMgmPopupService } from './data-recipient-mgm-popup.service';
import { DataRecipientMgmService } from './data-recipient-mgm.service';
import { DataOperationMgm, DataOperationMgmService } from '../data-operation-mgm';

@Component({
    selector: 'jhi-data-recipient-mgm-dialog',
    templateUrl: './data-recipient-mgm-dialog.component.html'
})
export class DataRecipientMgmDialogComponent implements OnInit {

    dataRecipient: DataRecipientMgm;
    isSaving: boolean;

    dataoperations: DataOperationMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private dataRecipientService: DataRecipientMgmService,
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
        if (this.dataRecipient.id !== undefined) {
            this.subscribeToSaveResponse(
                this.dataRecipientService.update(this.dataRecipient));
        } else {
            this.subscribeToSaveResponse(
                this.dataRecipientService.create(this.dataRecipient));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<DataRecipientMgm>>) {
        result.subscribe((res: HttpResponse<DataRecipientMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: DataRecipientMgm) {
        this.eventManager.broadcast({ name: 'dataRecipientListModification', content: 'OK'});
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
    selector: 'jhi-data-recipient-mgm-popup',
    template: ''
})
export class DataRecipientMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataRecipientPopupService: DataRecipientMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.dataRecipientPopupService
                    .open(DataRecipientMgmDialogComponent as Component, params['id']);
            } else {
                this.dataRecipientPopupService
                    .open(DataRecipientMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
