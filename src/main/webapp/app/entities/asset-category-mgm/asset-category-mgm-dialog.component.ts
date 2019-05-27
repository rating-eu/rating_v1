/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

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
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
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
