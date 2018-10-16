import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {AssetCategoryMgm} from './asset-category-mgm.model';
import {AssetCategoryMgmPopupService} from './asset-category-mgm-popup.service';
import {AssetCategoryMgmService} from './asset-category-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-asset-category-mgm-dialog',
    templateUrl: './asset-category-mgm-dialog.component.html'
})
export class AssetCategoryMgmDialogComponent implements OnInit {

    assetCategory: AssetCategoryMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private assetCategoryService: AssetCategoryMgmService,
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
        if (this.assetCategory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.assetCategoryService.update(this.assetCategory));
        } else {
            this.subscribeToSaveResponse(
                this.assetCategoryService.create(this.assetCategory));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<AssetCategoryMgm>>) {
        result.subscribe((res: HttpResponse<AssetCategoryMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: AssetCategoryMgm) {
        this.eventManager.broadcast({name: 'assetCategoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-asset-category-mgm-popup',
    template: ''
})
export class AssetCategoryMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private assetCategoryPopupService: AssetCategoryMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {
    }

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.assetCategoryPopupService
                        .open(AssetCategoryMgmDialogComponent as Component, params['id']);
                } else {
                    this.assetCategoryPopupService
                        .open(AssetCategoryMgmDialogComponent as Component);
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
