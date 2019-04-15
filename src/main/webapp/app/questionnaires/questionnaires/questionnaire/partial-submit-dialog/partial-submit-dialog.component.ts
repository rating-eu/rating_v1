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
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PopUpService} from '../../../../shared/pop-up-services/pop-up.service';
import {PartialSubmitPopupService} from './partial-submit-popup.service';

@Component({
    selector: 'jhi-partial-submit-dialog',
    templateUrl: './partial-submit-dialog.component.html'
})
export class PartialSubmitDialogComponent {

    constructor(
        public activeModal: NgbActiveModal,
    ) {
    }

    clear() {
        this.activeModal.close(false);
    }

    confirm() {
        this.activeModal.close(true);
    }

    cancel() {
        this.activeModal.close(false);
    }
}

@Component({
    selector: 'jhi-partial-submit-popup',
    template: ''
})
export class PartialSubmitPopupComponent implements OnInit, OnDestroy {

    constructor(
        private partialSubmitPopupService: PartialSubmitPopupService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.partialSubmitPopupService
                .open(PartialSubmitDialogComponent as Component);
        }
    }

    ngOnDestroy() {
    }
}
