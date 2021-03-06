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

import { MitigationMgm } from './mitigation-mgm.model';
import { MitigationMgmPopupService } from './mitigation-mgm-popup.service';
import { MitigationMgmService } from './mitigation-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-mitigation-mgm-dialog',
    templateUrl: './mitigation-mgm-dialog.component.html'
})
export class MitigationMgmDialogComponent implements OnInit {

    mitigation: MitigationMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private mitigationService: MitigationMgmService,
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
        if (this.mitigation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.mitigationService.update(this.mitigation));
        } else {
            this.subscribeToSaveResponse(
                this.mitigationService.create(this.mitigation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MitigationMgm>>) {
        result.subscribe((res: HttpResponse<MitigationMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MitigationMgm) {
        this.eventManager.broadcast({ name: 'mitigationListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-mitigation-mgm-popup',
    template: ''
})
export class MitigationMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private mitigationPopupService: MitigationMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.mitigationPopupService
                        .open(MitigationMgmDialogComponent as Component, params['id']);
                } else {
                    this.mitigationPopupService
                        .open(MitigationMgmDialogComponent as Component);
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
