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

import { LevelMgm } from './level-mgm.model';
import { LevelMgmPopupService } from './level-mgm-popup.service';
import { LevelMgmService } from './level-mgm.service';
import { ContainerMgm, ContainerMgmService } from '../container-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-level-mgm-dialog',
    templateUrl: './level-mgm-dialog.component.html'
})
export class LevelMgmDialogComponent implements OnInit {

    level: LevelMgm;
    isSaving: boolean;

    containers: ContainerMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private levelService: LevelMgmService,
        private containerService: ContainerMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.containerService
            .query({ filter: 'level-is-null' })
            .subscribe((res: HttpResponse<ContainerMgm[]>) => {
                if (!this.level.container || !this.level.container.id) {
                    this.containers = res.body;
                } else {
                    this.containerService
                        .find(this.level.container.id)
                        .subscribe((subRes: HttpResponse<ContainerMgm>) => {
                            this.containers = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.level.id !== undefined) {
            this.subscribeToSaveResponse(
                this.levelService.update(this.level));
        } else {
            this.subscribeToSaveResponse(
                this.levelService.create(this.level));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LevelMgm>>) {
        result.subscribe((res: HttpResponse<LevelMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LevelMgm) {
        this.eventManager.broadcast({ name: 'levelListModification', content: 'OK' });
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
}

@Component({
    selector: 'jhi-level-mgm-popup',
    template: ''
})
export class LevelMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private levelPopupService: LevelMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.levelPopupService
                        .open(LevelMgmDialogComponent as Component, params['id']);
                } else {
                    this.levelPopupService
                        .open(LevelMgmDialogComponent as Component);
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
