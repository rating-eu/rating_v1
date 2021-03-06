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

import { ImpactLevelDescriptionMgm } from './impact-level-description-mgm.model';
import { ImpactLevelDescriptionMgmPopupService } from './impact-level-description-mgm-popup.service';
import { ImpactLevelDescriptionMgmService } from './impact-level-description-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-impact-level-description-mgm-dialog',
    templateUrl: './impact-level-description-mgm-dialog.component.html'
})
export class ImpactLevelDescriptionMgmDialogComponent implements OnInit {

    impactLevelDescription: ImpactLevelDescriptionMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private impactLevelDescriptionService: ImpactLevelDescriptionMgmService,
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
        if (this.impactLevelDescription.id !== undefined) {
            this.subscribeToSaveResponse(
                this.impactLevelDescriptionService.update(this.impactLevelDescription));
        } else {
            this.subscribeToSaveResponse(
                this.impactLevelDescriptionService.create(this.impactLevelDescription));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ImpactLevelDescriptionMgm>>) {
        result.subscribe((res: HttpResponse<ImpactLevelDescriptionMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ImpactLevelDescriptionMgm) {
        this.eventManager.broadcast({ name: 'impactLevelDescriptionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-impact-level-description-mgm-popup',
    template: ''
})
export class ImpactLevelDescriptionMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private impactLevelDescriptionPopupService: ImpactLevelDescriptionMgmPopupService,
        public popUpService: PopUpService
    ) {}

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if ( params['id'] ) {
                    this.impactLevelDescriptionPopupService
                        .open(ImpactLevelDescriptionMgmDialogComponent as Component, params['id']);
                } else {
                    this.impactLevelDescriptionPopupService
                        .open(ImpactLevelDescriptionMgmDialogComponent as Component);
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
