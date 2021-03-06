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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AssetMgm } from './asset-mgm.model';
import { AssetMgmPopupService } from './asset-mgm-popup.service';
import { AssetMgmService } from './asset-mgm.service';
import { ContainerMgm, ContainerMgmService } from '../container-mgm';
import { DomainOfInfluenceMgm, DomainOfInfluenceMgmService } from '../domain-of-influence-mgm';
import { AssetCategoryMgm, AssetCategoryMgmService } from '../asset-category-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-asset-mgm-dialog',
    templateUrl: './asset-mgm-dialog.component.html'
})
export class AssetMgmDialogComponent implements OnInit {

    asset: AssetMgm;
    isSaving: boolean;

    containers: ContainerMgm[];

    domainofinfluences: DomainOfInfluenceMgm[];

    assetcategories: AssetCategoryMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private assetService: AssetMgmService,
        private containerService: ContainerMgmService,
        private domainOfInfluenceService: DomainOfInfluenceMgmService,
        private assetCategoryService: AssetCategoryMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.containerService.query()
            .subscribe((res: HttpResponse<ContainerMgm[]>) => { this.containers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.domainOfInfluenceService.query()
            .subscribe((res: HttpResponse<DomainOfInfluenceMgm[]>) => { this.domainofinfluences = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.assetCategoryService.query()
            .subscribe((res: HttpResponse<AssetCategoryMgm[]>) => { this.assetcategories = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.asset.id !== undefined) {
            this.subscribeToSaveResponse(
                this.assetService.update(this.asset));
        } else {
            this.subscribeToSaveResponse(
                this.assetService.create(this.asset));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<AssetMgm>>) {
        result.subscribe((res: HttpResponse<AssetMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: AssetMgm) {
        this.eventManager.broadcast({ name: 'assetListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackContainerById(index: number, item: ContainerMgm) {
        return item.id;
    }

    trackDomainOfInfluenceById(index: number, item: DomainOfInfluenceMgm) {
        return item.id;
    }

    trackAssetCategoryById(index: number, item: AssetCategoryMgm) {
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
    selector: 'jhi-asset-mgm-popup',
    template: ''
})
export class AssetMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private assetPopupService: AssetMgmPopupService,
        private sessionStorage: SessionStorageService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.assetPopupService
                        .open(AssetMgmDialogComponent as Component, params['id']);
                } else {
                    this.assetPopupService
                        .open(AssetMgmDialogComponent as Component);
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
