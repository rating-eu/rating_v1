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
import {ActivatedRoute, Router} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {SelfAssessmentMgm} from './self-assessment-mgm.model';
import {SelfAssessmentMgmPopupService} from './self-assessment-mgm-popup.service';
import {SelfAssessmentMgmService} from './self-assessment-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {EventManagerService} from '../../datasharing/event-manager.service';
import {Event} from '../../datasharing/event.model';
import {EventType} from '../enumerations/EventType.enum';
import {ActionType} from '../enumerations/ActionType.enum';

@Component({
    selector: 'jhi-self-assessment-mgm-delete-dialog',
    templateUrl: './self-assessment-mgm-delete-dialog.component.html'
})
export class SelfAssessmentMgmDeleteDialogComponent {

    selfAssessment: SelfAssessmentMgm;

    constructor(
        private selfAssessmentService: SelfAssessmentMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private router: Router,
        private dataSharingService: DatasharingService,
        private eventManagerService: EventManagerService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.selfAssessmentService.delete(id).subscribe((response) => {

            this.eventManager.broadcast({
                name: 'selfAssessmentListModification',
                content: 'Deleted an selfAssessment'
            });

            this.eventManagerService.broadcast(new Event(EventType.RISK_ASSESSMENT_LIST_UPDATE, ActionType.DELETE));

            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-self-assessment-mgm-delete-popup',
    template: ''
})
export class SelfAssessmentMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private selfAssessmentPopupService: SelfAssessmentMgmPopupService,
        private sessionStorage: SessionStorageService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.selfAssessmentPopupService
                    .open(SelfAssessmentMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
