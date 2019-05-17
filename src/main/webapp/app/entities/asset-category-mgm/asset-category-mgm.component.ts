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
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AssetCategoryMgm } from './asset-category-mgm.model';
import { AssetCategoryMgmService } from './asset-category-mgm.service';
import { Principal } from '../../shared';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-asset-category-mgm',
    templateUrl: './asset-category-mgm.component.html'
})
export class AssetCategoryMgmComponent implements OnInit, OnDestroy {
assetCategories: AssetCategoryMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private assetCategoryService: AssetCategoryMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        public popUpService: PopUpService
    ) {
    }

    loadAll() {
        this.assetCategoryService.query().subscribe(
            (res: HttpResponse<AssetCategoryMgm[]>) => {
                this.assetCategories = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    clear() {
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInAssetCategories();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AssetCategoryMgm) {
        return item.id;
    }
    registerChangeInAssetCategories() {
        this.eventSubscriber = this.eventManager.subscribe('assetCategoryListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
