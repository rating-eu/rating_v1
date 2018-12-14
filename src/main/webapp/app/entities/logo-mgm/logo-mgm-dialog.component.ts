import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { LogoMgm } from './logo-mgm.model';
import { LogoMgmPopupService } from './logo-mgm-popup.service';
import { LogoMgmService } from './logo-mgm.service';

@Component({
    selector: 'jhi-logo-mgm-dialog',
    templateUrl: './logo-mgm-dialog.component.html'
})
export class LogoMgmDialogComponent implements OnInit {

    logo: LogoMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private logoService: LogoMgmService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.logo, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.logo.id !== undefined) {
            this.subscribeToSaveResponse(
                this.logoService.update(this.logo));
        } else {
            this.subscribeToSaveResponse(
                this.logoService.create(this.logo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LogoMgm>>) {
        result.subscribe((res: HttpResponse<LogoMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LogoMgm) {
        this.eventManager.broadcast({ name: 'logoListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-logo-mgm-popup',
    template: ''
})
export class LogoMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private logoPopupService: LogoMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.logoPopupService
                    .open(LogoMgmDialogComponent as Component, params['id']);
            } else {
                this.logoPopupService
                    .open(LogoMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
