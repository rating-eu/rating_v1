import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OverallSecurityImpactMgm } from './overall-security-impact-mgm.model';
import { OverallSecurityImpactMgmPopupService } from './overall-security-impact-mgm-popup.service';
import { OverallSecurityImpactMgmService } from './overall-security-impact-mgm.service';
import { DataOperationMgm, DataOperationMgmService } from '../data-operation-mgm';

@Component({
    selector: 'jhi-overall-security-impact-mgm-dialog',
    templateUrl: './overall-security-impact-mgm-dialog.component.html'
})
export class OverallSecurityImpactMgmDialogComponent implements OnInit {

    overallSecurityImpact: OverallSecurityImpactMgm;
    isSaving: boolean;

    operations: DataOperationMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private overallSecurityImpactService: OverallSecurityImpactMgmService,
        private dataOperationService: DataOperationMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.dataOperationService
            .query({filter: 'overallsecurityimpact-is-null'})
            .subscribe((res: HttpResponse<DataOperationMgm[]>) => {
                if (!this.overallSecurityImpact.operation || !this.overallSecurityImpact.operation.id) {
                    this.operations = res.body;
                } else {
                    this.dataOperationService
                        .find(this.overallSecurityImpact.operation.id)
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
        if (this.overallSecurityImpact.id !== undefined) {
            this.subscribeToSaveResponse(
                this.overallSecurityImpactService.update(this.overallSecurityImpact));
        } else {
            this.subscribeToSaveResponse(
                this.overallSecurityImpactService.create(this.overallSecurityImpact));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<OverallSecurityImpactMgm>>) {
        result.subscribe((res: HttpResponse<OverallSecurityImpactMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: OverallSecurityImpactMgm) {
        this.eventManager.broadcast({ name: 'overallSecurityImpactListModification', content: 'OK'});
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
    selector: 'jhi-overall-security-impact-mgm-popup',
    template: ''
})
export class OverallSecurityImpactMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private overallSecurityImpactPopupService: OverallSecurityImpactMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.overallSecurityImpactPopupService
                    .open(OverallSecurityImpactMgmDialogComponent as Component, params['id']);
            } else {
                this.overallSecurityImpactPopupService
                    .open(OverallSecurityImpactMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
