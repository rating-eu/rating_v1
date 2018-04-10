import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ContainerMgm } from './container-mgm.model';
import { ContainerMgmPopupService } from './container-mgm-popup.service';
import { ContainerMgmService } from './container-mgm.service';
import { CompanyProfileMgm, CompanyProfileMgmService } from '../company-profile-mgm';
import { AssetMgm, AssetMgmService } from '../asset-mgm';

@Component({
    selector: 'jhi-container-mgm-dialog',
    templateUrl: './container-mgm-dialog.component.html'
})
export class ContainerMgmDialogComponent implements OnInit {

    container: ContainerMgm;
    isSaving: boolean;

    companyprofiles: CompanyProfileMgm[];

    assets: AssetMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private containerService: ContainerMgmService,
        private companyProfileService: CompanyProfileMgmService,
        private assetService: AssetMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.companyProfileService.query()
            .subscribe((res: HttpResponse<CompanyProfileMgm[]>) => { this.companyprofiles = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.assetService.query()
            .subscribe((res: HttpResponse<AssetMgm[]>) => { this.assets = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.container.id !== undefined) {
            this.subscribeToSaveResponse(
                this.containerService.update(this.container));
        } else {
            this.subscribeToSaveResponse(
                this.containerService.create(this.container));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ContainerMgm>>) {
        result.subscribe((res: HttpResponse<ContainerMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ContainerMgm) {
        this.eventManager.broadcast({ name: 'containerListModification', content: 'OK'});
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

    trackAssetById(index: number, item: AssetMgm) {
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
    selector: 'jhi-container-mgm-popup',
    template: ''
})
export class ContainerMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private containerPopupService: ContainerMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.containerPopupService
                    .open(ContainerMgmDialogComponent as Component, params['id']);
            } else {
                this.containerPopupService
                    .open(ContainerMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
