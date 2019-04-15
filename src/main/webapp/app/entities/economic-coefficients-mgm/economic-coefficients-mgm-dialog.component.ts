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

import { EconomicCoefficientsMgm } from './economic-coefficients-mgm.model';
import { EconomicCoefficientsMgmPopupService } from './economic-coefficients-mgm-popup.service';
import { EconomicCoefficientsMgmService } from './economic-coefficients-mgm.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';
import {SessionStorageService} from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-economic-coefficients-mgm-dialog',
    templateUrl: './economic-coefficients-mgm-dialog.component.html'
})
export class EconomicCoefficientsMgmDialogComponent implements OnInit {

    economicCoefficients: EconomicCoefficientsMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private economicCoefficientsService: EconomicCoefficientsMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.selfAssessmentService
            .query({filter: 'economiccoefficients-is-null'})
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => {
                if (!this.economicCoefficients.selfAssessment || !this.economicCoefficients.selfAssessment.id) {
                    this.selfassessments = res.body;
                } else {
                    this.selfAssessmentService
                        .find(this.economicCoefficients.selfAssessment.id)
                        .subscribe((subRes: HttpResponse<SelfAssessmentMgm>) => {
                            this.selfassessments = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.economicCoefficients.id !== undefined) {
            this.subscribeToSaveResponse(
                this.economicCoefficientsService.update(this.economicCoefficients));
        } else {
            this.subscribeToSaveResponse(
                this.economicCoefficientsService.create(this.economicCoefficients));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<EconomicCoefficientsMgm>>) {
        result.subscribe((res: HttpResponse<EconomicCoefficientsMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: EconomicCoefficientsMgm) {
        this.eventManager.broadcast({ name: 'economicCoefficientsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackSelfAssessmentById(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-economic-coefficients-mgm-popup',
    template: ''
})
export class EconomicCoefficientsMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private economicCoefficientsPopupService: EconomicCoefficientsMgmPopupService,
        public popUpService: PopUpService
    ) {}

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if ( params['id'] ) {
                    this.economicCoefficientsPopupService
                        .open(EconomicCoefficientsMgmDialogComponent as Component, params['id']);
                } else {
                    this.economicCoefficientsPopupService
                        .open(EconomicCoefficientsMgmDialogComponent as Component);
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
