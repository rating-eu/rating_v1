import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SystemConfigMgm } from './system-config-mgm.model';
import { SystemConfigMgmPopupService } from './system-config-mgm-popup.service';
import { SystemConfigMgmService } from './system-config-mgm.service';

@Component({
    selector: 'jhi-system-config-mgm-dialog',
    templateUrl: './system-config-mgm-dialog.component.html'
})
export class SystemConfigMgmDialogComponent implements OnInit {

    systemConfig: SystemConfigMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private systemConfigService: SystemConfigMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.systemConfig.id !== undefined) {
            this.subscribeToSaveResponse(
                this.systemConfigService.update(this.systemConfig));
        } else {
            this.subscribeToSaveResponse(
                this.systemConfigService.create(this.systemConfig));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SystemConfigMgm>>) {
        result.subscribe((res: HttpResponse<SystemConfigMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SystemConfigMgm) {
        this.eventManager.broadcast({ name: 'systemConfigListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-system-config-mgm-popup',
    template: ''
})
export class SystemConfigMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private systemConfigPopupService: SystemConfigMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.systemConfigPopupService
                    .open(SystemConfigMgmDialogComponent as Component, params['id']);
            } else {
                this.systemConfigPopupService
                    .open(SystemConfigMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
