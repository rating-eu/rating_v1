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
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {EconomicCoefficientsMgm} from './economic-coefficients-mgm.model';
import {EconomicCoefficientsMgmPopupService} from './economic-coefficients-mgm-popup.service';
import {EconomicCoefficientsMgmService} from './economic-coefficients-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-economic-coefficients-mgm-delete-dialog',
    templateUrl: './economic-coefficients-mgm-delete-dialog.component.html'
})
export class EconomicCoefficientsMgmDeleteDialogComponent {

    economicCoefficients: EconomicCoefficientsMgm;

    constructor(
        private economicCoefficientsService: EconomicCoefficientsMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.economicCoefficientsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'economicCoefficientsListModification',
                content: 'Deleted an economicCoefficients'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-economic-coefficients-mgm-delete-popup',
    template: ''
})
export class EconomicCoefficientsMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private economicCoefficientsPopupService: EconomicCoefficientsMgmPopupService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.economicCoefficientsPopupService
                    .open(EconomicCoefficientsMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
