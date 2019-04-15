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

import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {SelfAssessmentMgm} from './self-assessment-mgm.model';
import {SelfAssessmentMgmPopupService} from './self-assessment-mgm-popup.service';
import {SelfAssessmentMgmService} from './self-assessment-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';
import {DatasharingService} from '../../datasharing/datasharing.service';

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
        private dataSharingService: DatasharingService
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

            // TODO think of an alternative method only for update view events
            this.dataSharingService.updateMySelfAssessment(null);

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
