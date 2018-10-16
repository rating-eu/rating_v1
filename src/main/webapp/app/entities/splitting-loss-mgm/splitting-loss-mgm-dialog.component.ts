import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SplittingLossMgm } from './splitting-loss-mgm.model';
import { SplittingLossMgmPopupService } from './splitting-loss-mgm-popup.service';
import { SplittingLossMgmService } from './splitting-loss-mgm.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-splitting-loss-mgm-dialog',
    templateUrl: './splitting-loss-mgm-dialog.component.html'
})
export class SplittingLossMgmDialogComponent implements OnInit {

    splittingLoss: SplittingLossMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private splittingLossService: SplittingLossMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.selfAssessmentService
            .query({filter: 'splittingloss-is-null'})
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => {
                if (!this.splittingLoss.selfAssessment || !this.splittingLoss.selfAssessment.id) {
                    this.selfassessments = res.body;
                } else {
                    this.selfAssessmentService
                        .find(this.splittingLoss.selfAssessment.id)
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
        if (this.splittingLoss.id !== undefined) {
            this.subscribeToSaveResponse(
                this.splittingLossService.update(this.splittingLoss));
        } else {
            this.subscribeToSaveResponse(
                this.splittingLossService.create(this.splittingLoss));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SplittingLossMgm>>) {
        result.subscribe((res: HttpResponse<SplittingLossMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SplittingLossMgm) {
        this.eventManager.broadcast({ name: 'splittingLossListModification', content: 'OK'});
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
    selector: 'jhi-splitting-loss-mgm-popup',
    template: ''
})
export class SplittingLossMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private splittingLossPopupService: SplittingLossMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if ( params['id'] ) {
                    this.splittingLossPopupService
                        .open(SplittingLossMgmDialogComponent as Component, params['id']);
                } else {
                    this.splittingLossPopupService
                        .open(SplittingLossMgmDialogComponent as Component);
                }
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
