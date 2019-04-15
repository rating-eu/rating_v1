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
import { JhiEventManager } from 'ng-jhipster';

import { ImpactLevelMgm } from './impact-level-mgm.model';
import { ImpactLevelMgmPopupService } from './impact-level-mgm-popup.service';
import { ImpactLevelMgmService } from './impact-level-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-impact-level-mgm-dialog',
    templateUrl: './impact-level-mgm-dialog.component.html'
})
export class ImpactLevelMgmDialogComponent implements OnInit {

    impactLevel: ImpactLevelMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private impactLevelService: ImpactLevelMgmService,
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
        if (this.impactLevel.id !== undefined) {
            this.subscribeToSaveResponse(
                this.impactLevelService.update(this.impactLevel));
        } else {
            this.subscribeToSaveResponse(
                this.impactLevelService.create(this.impactLevel));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ImpactLevelMgm>>) {
        result.subscribe((res: HttpResponse<ImpactLevelMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ImpactLevelMgm) {
        this.eventManager.broadcast({ name: 'impactLevelListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-impact-level-mgm-popup',
    template: ''
})
export class ImpactLevelMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private impactLevelPopupService: ImpactLevelMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.impactLevelPopupService
                        .open(ImpactLevelMgmDialogComponent as Component, params['id']);
                } else {
                    this.impactLevelPopupService
                        .open(ImpactLevelMgmDialogComponent as Component);
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
