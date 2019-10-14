import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DataOperationMgm } from './data-operation-mgm.model';
import { DataOperationMgmPopupService } from './data-operation-mgm-popup.service';
import { DataOperationMgmService } from './data-operation-mgm.service';
import { CompanyProfileMgm, CompanyProfileMgmService } from '../company-profile-mgm';

@Component({
    selector: 'jhi-data-operation-mgm-dialog',
    templateUrl: './data-operation-mgm-dialog.component.html'
})
export class DataOperationMgmDialogComponent implements OnInit {

    dataOperation: DataOperationMgm;
    isSaving: boolean;

    companyprofiles: CompanyProfileMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private dataOperationService: DataOperationMgmService,
        private companyProfileService: CompanyProfileMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.companyProfileService.query()
            .subscribe((res: HttpResponse<CompanyProfileMgm[]>) => { this.companyprofiles = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.dataOperation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.dataOperationService.update(this.dataOperation));
        } else {
            this.subscribeToSaveResponse(
                this.dataOperationService.create(this.dataOperation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<DataOperationMgm>>) {
        result.subscribe((res: HttpResponse<DataOperationMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: DataOperationMgm) {
        this.eventManager.broadcast({ name: 'dataOperationListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackCompanyProfileById(index: number, item: CompanyProfileMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-data-operation-mgm-popup',
    template: ''
})
export class DataOperationMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataOperationPopupService: DataOperationMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.dataOperationPopupService
                    .open(DataOperationMgmDialogComponent as Component, params['id']);
            } else {
                this.dataOperationPopupService
                    .open(DataOperationMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
