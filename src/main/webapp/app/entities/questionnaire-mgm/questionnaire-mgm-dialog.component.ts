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

import { QuestionnaireMgm } from './questionnaire-mgm.model';
import { QuestionnaireMgmPopupService } from './questionnaire-mgm-popup.service';
import { QuestionnaireMgmService } from './questionnaire-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-questionnaire-mgm-dialog',
    templateUrl: './questionnaire-mgm-dialog.component.html'
})
export class QuestionnaireMgmDialogComponent implements OnInit {

    questionnaire: QuestionnaireMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private questionnaireService: QuestionnaireMgmService,
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
        if (this.questionnaire.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionnaireService.update(this.questionnaire));
        } else {
            this.subscribeToSaveResponse(
                this.questionnaireService.create(this.questionnaire));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionnaireMgm>>) {
        result.subscribe((res: HttpResponse<QuestionnaireMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionnaireMgm) {
        this.eventManager.broadcast({ name: 'questionnaireListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-questionnaire-mgm-popup',
    template: ''
})
export class QuestionnaireMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionnairePopupService: QuestionnaireMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.questionnairePopupService
                        .open(QuestionnaireMgmDialogComponent as Component, params['id']);
                } else {
                    this.questionnairePopupService
                        .open(QuestionnaireMgmDialogComponent as Component);
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
