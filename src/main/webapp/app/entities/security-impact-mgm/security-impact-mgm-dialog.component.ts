import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SecurityImpactMgm } from './security-impact-mgm.model';
import { SecurityImpactMgmPopupService } from './security-impact-mgm-popup.service';
import { SecurityImpactMgmService } from './security-impact-mgm.service';
import { DataOperationMgm, DataOperationMgmService } from '../data-operation-mgm';
import { OverallSecurityImpactMgm, OverallSecurityImpactMgmService } from '../overall-security-impact-mgm';

@Component({
    selector: 'jhi-security-impact-mgm-dialog',
    templateUrl: './security-impact-mgm-dialog.component.html'
})
export class SecurityImpactMgmDialogComponent implements OnInit {

    securityImpact: SecurityImpactMgm;
    isSaving: boolean;

    dataoperations: DataOperationMgm[];

    overallsecurityimpacts: OverallSecurityImpactMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private securityImpactService: SecurityImpactMgmService,
        private dataOperationService: DataOperationMgmService,
        private overallSecurityImpactService: OverallSecurityImpactMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.dataOperationService.query()
            .subscribe((res: HttpResponse<DataOperationMgm[]>) => { this.dataoperations = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.overallSecurityImpactService.query()
            .subscribe((res: HttpResponse<OverallSecurityImpactMgm[]>) => { this.overallsecurityimpacts = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.securityImpact.id !== undefined) {
            this.subscribeToSaveResponse(
                this.securityImpactService.update(this.securityImpact));
        } else {
            this.subscribeToSaveResponse(
                this.securityImpactService.create(this.securityImpact));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SecurityImpactMgm>>) {
        result.subscribe((res: HttpResponse<SecurityImpactMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SecurityImpactMgm) {
        this.eventManager.broadcast({ name: 'securityImpactListModification', content: 'OK'});
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

    trackOverallSecurityImpactById(index: number, item: OverallSecurityImpactMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-security-impact-mgm-popup',
    template: ''
})
export class SecurityImpactMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private securityImpactPopupService: SecurityImpactMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.securityImpactPopupService
                    .open(SecurityImpactMgmDialogComponent as Component, params['id']);
            } else {
                this.securityImpactPopupService
                    .open(SecurityImpactMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
