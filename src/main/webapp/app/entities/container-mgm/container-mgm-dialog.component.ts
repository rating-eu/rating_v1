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

import { ContainerMgm } from './container-mgm.model';
import { ContainerMgmPopupService } from './container-mgm-popup.service';
import { ContainerMgmService } from './container-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-container-mgm-dialog',
    templateUrl: './container-mgm-dialog.component.html'
})
export class ContainerMgmDialogComponent implements OnInit {

    container: ContainerMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private containerService: ContainerMgmService,
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
        if (this.container.id !== undefined) {
            this.subscribeToSaveResponse(
                this.containerService.update(this.container));
        } else {
            this.subscribeToSaveResponse(
                this.containerService.create(this.container));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ContainerMgm>>) {
        result.subscribe((res: HttpResponse<ContainerMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ContainerMgm) {
        this.eventManager.broadcast({ name: 'containerListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-container-mgm-popup',
    template: ''
})
export class ContainerMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private containerPopupService: ContainerMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.containerPopupService
                        .open(ContainerMgmDialogComponent as Component, params['id']);
                } else {
                    this.containerPopupService
                        .open(ContainerMgmDialogComponent as Component);
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
