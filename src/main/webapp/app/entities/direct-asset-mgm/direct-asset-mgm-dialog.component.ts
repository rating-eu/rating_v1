import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {DirectAssetMgm} from './direct-asset-mgm.model';
import {DirectAssetMgmPopupService} from './direct-asset-mgm-popup.service';
import {DirectAssetMgmService} from './direct-asset-mgm.service';
import {MyAssetMgm, MyAssetMgmService} from '../my-asset-mgm';
import {SessionStorageService} from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-direct-asset-mgm-dialog',
    templateUrl: './direct-asset-mgm-dialog.component.html'
})
export class DirectAssetMgmDialogComponent implements OnInit {

    directAsset: DirectAssetMgm;
    isSaving: boolean;

    myassets: MyAssetMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private directAssetService: DirectAssetMgmService,
        private myAssetService: MyAssetMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.myAssetService
            .query({filter: 'directasset-is-null'})
            .subscribe((res: HttpResponse<MyAssetMgm[]>) => {
                if (!this.directAsset.myAsset || !this.directAsset.myAsset.id) {
                    this.myassets = res.body;
                } else {
                    this.myAssetService
                        .find(this.directAsset.myAsset.id)
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
        if (this.directAsset.id !== undefined) {
            this.subscribeToSaveResponse(
                this.directAssetService.update(this.directAsset));
        } else {
            this.subscribeToSaveResponse(
                this.directAssetService.create(this.directAsset));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<DirectAssetMgm>>) {
        result.subscribe((res: HttpResponse<DirectAssetMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: DirectAssetMgm) {
        this.eventManager.broadcast({name: 'directAssetListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackMyAssetById(index: number, item: MyAssetMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-direct-asset-mgm-popup',
    template: ''
})
export class DirectAssetMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private directAssetPopupService: DirectAssetMgmPopupService,
        private popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.directAssetPopupService
                        .open(DirectAssetMgmDialogComponent as Component, params['id']);
                } else {
                    this.directAssetPopupService
                        .open(DirectAssetMgmDialogComponent as Component);
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
