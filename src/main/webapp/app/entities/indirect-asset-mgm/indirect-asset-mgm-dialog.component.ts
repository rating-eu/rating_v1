import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IndirectAssetMgm } from './indirect-asset-mgm.model';
import { IndirectAssetMgmPopupService } from './indirect-asset-mgm-popup.service';
import { IndirectAssetMgmService } from './indirect-asset-mgm.service';
import { DirectAssetMgm, DirectAssetMgmService } from '../direct-asset-mgm';
import { MyAssetMgm, MyAssetMgmService } from '../my-asset-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-indirect-asset-mgm-dialog',
    templateUrl: './indirect-asset-mgm-dialog.component.html'
})
export class IndirectAssetMgmDialogComponent implements OnInit {

    indirectAsset: IndirectAssetMgm;
    isSaving: boolean;

    directassets: DirectAssetMgm[];

    myassets: MyAssetMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private indirectAssetService: IndirectAssetMgmService,
        private directAssetService: DirectAssetMgmService,
        private myAssetService: MyAssetMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.directAssetService.query()
            .subscribe((res: HttpResponse<DirectAssetMgm[]>) => { this.directassets = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.myAssetService
            .query({ filter: 'indirectasset-is-null' })
            .subscribe((res: HttpResponse<MyAssetMgm[]>) => {
                if (!this.indirectAsset.myAsset || !this.indirectAsset.myAsset.id) {
                    this.myassets = res.body;
                } else {
                    this.myAssetService
                        .find(this.indirectAsset.myAsset.id)
                        .subscribe((subRes: HttpResponse<MyAssetMgm>) => {
                            this.myassets = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.indirectAsset.id !== undefined) {
            this.subscribeToSaveResponse(
                this.indirectAssetService.update(this.indirectAsset));
        } else {
            this.subscribeToSaveResponse(
                this.indirectAssetService.create(this.indirectAsset));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IndirectAssetMgm>>) {
        result.subscribe((res: HttpResponse<IndirectAssetMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IndirectAssetMgm) {
        this.eventManager.broadcast({ name: 'indirectAssetListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackDirectAssetById(index: number, item: DirectAssetMgm) {
        return item.id;
    }

    trackMyAssetById(index: number, item: MyAssetMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-indirect-asset-mgm-popup',
    template: ''
})
export class IndirectAssetMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private indirectAssetPopupService: IndirectAssetMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.indirectAssetPopupService
                        .open(IndirectAssetMgmDialogComponent as Component, params['id']);
                } else {
                    this.indirectAssetPopupService
                        .open(IndirectAssetMgmDialogComponent as Component);
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
