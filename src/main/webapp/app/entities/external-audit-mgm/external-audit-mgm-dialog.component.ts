import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ExternalAuditMgm } from './external-audit-mgm.model';
import { ExternalAuditMgmPopupService } from './external-audit-mgm-popup.service';
import { ExternalAuditMgmService } from './external-audit-mgm.service';
import { User, UserService } from '../../shared';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';

@Component({
    selector: 'jhi-external-audit-mgm-dialog',
    templateUrl: './external-audit-mgm-dialog.component.html'
})
export class ExternalAuditMgmDialogComponent implements OnInit {

    externalAudit: ExternalAuditMgm;
    isSaving: boolean;

    users: User[];

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private externalAuditService: ExternalAuditMgmService,
        private userService: UserService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.selfAssessmentService.query()
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => { this.selfassessments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.externalAudit.id !== undefined) {
            this.subscribeToSaveResponse(
                this.externalAuditService.update(this.externalAudit));
        } else {
            this.subscribeToSaveResponse(
                this.externalAuditService.create(this.externalAudit));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ExternalAuditMgm>>) {
        result.subscribe((res: HttpResponse<ExternalAuditMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ExternalAuditMgm) {
        this.eventManager.broadcast({ name: 'externalAuditListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }

    trackSelfAssessmentById(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-external-audit-mgm-popup',
    template: ''
})
export class ExternalAuditMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private externalAuditPopupService: ExternalAuditMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.externalAuditPopupService
                    .open(ExternalAuditMgmDialogComponent as Component, params['id']);
            } else {
                this.externalAuditPopupService
                    .open(ExternalAuditMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
