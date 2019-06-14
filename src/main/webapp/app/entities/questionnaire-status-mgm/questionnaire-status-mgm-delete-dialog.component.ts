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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {QuestionnaireStatusMgm} from './questionnaire-status-mgm.model';
import {QuestionnaireStatusMgmPopupService} from './questionnaire-status-mgm-popup.service';
import {QuestionnaireStatusMgmService} from './questionnaire-status-mgm.service';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';
import {EventManagerService} from '../../datasharing/event-manager.service';

import {Event} from '../../datasharing/event.model';
import {EventType} from '../enumerations/EventType.enum';
import {ActionType} from '../enumerations/ActionType.enum';

@Component({
    selector: 'jhi-questionnaire-status-mgm-delete-dialog',
    templateUrl: './questionnaire-status-mgm-delete-dialog.component.html'
})
export class QuestionnaireStatusMgmDeleteDialogComponent {

    questionnaireStatus: QuestionnaireStatusMgm;

    constructor(
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private eventManagerService: EventManagerService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionnaireStatusService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionnaireStatusListModification',
                content: 'Deleted a questionnaireStatus'
            });

            console.error('Broadcasting QSTatus delete event...');

            this.eventManagerService.broadcast(new Event(EventType.QUESTIONNAIRE_STATUS_LIST_UPDATE, ActionType.DELETE));
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-questionnaire-status-mgm-delete-popup',
    template: ''
})
export class QuestionnaireStatusMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionnaireStatusPopupService: QuestionnaireStatusMgmPopupService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.questionnaireStatusPopupService
                    .open(QuestionnaireStatusMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
