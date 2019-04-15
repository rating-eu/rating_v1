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

import { PhaseMgm } from './phase-mgm.model';
import { PhaseMgmPopupService } from './phase-mgm-popup.service';
import { PhaseMgmService } from './phase-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-phase-mgm-dialog',
    templateUrl: './phase-mgm-dialog.component.html'
})
export class PhaseMgmDialogComponent implements OnInit {

    phase: PhaseMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private phaseService: PhaseMgmService,
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
        if (this.phase.id !== undefined) {
            this.subscribeToSaveResponse(
                this.phaseService.update(this.phase));
        } else {
            this.subscribeToSaveResponse(
                this.phaseService.create(this.phase));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<PhaseMgm>>) {
        result.subscribe((res: HttpResponse<PhaseMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: PhaseMgm) {
        this.eventManager.broadcast({ name: 'phaseListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-phase-mgm-popup',
    template: ''
})
export class PhaseMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private phasePopupService: PhaseMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.phasePopupService
                        .open(PhaseMgmDialogComponent as Component, params['id']);
                } else {
                    this.phasePopupService
                        .open(PhaseMgmDialogComponent as Component);
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
