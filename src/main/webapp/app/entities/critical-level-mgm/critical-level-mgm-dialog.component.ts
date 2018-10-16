import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CriticalLevelMgm } from './critical-level-mgm.model';
import { CriticalLevelMgmPopupService } from './critical-level-mgm-popup.service';
import { CriticalLevelMgmService } from './critical-level-mgm.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-critical-level-mgm-dialog',
    templateUrl: './critical-level-mgm-dialog.component.html'
})
export class CriticalLevelMgmDialogComponent implements OnInit {

    criticalLevel: CriticalLevelMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private criticalLevelService: CriticalLevelMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.selfAssessmentService
            .query({filter: 'criticallevel-is-null'})
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => {
                if (!this.criticalLevel.selfAssessment || !this.criticalLevel.selfAssessment.id) {
                    this.selfassessments = res.body;
                } else {
                    this.selfAssessmentService
                        .find(this.criticalLevel.selfAssessment.id)
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
        if (this.criticalLevel.id !== undefined) {
            this.subscribeToSaveResponse(
                this.criticalLevelService.update(this.criticalLevel));
        } else {
            this.subscribeToSaveResponse(
                this.criticalLevelService.create(this.criticalLevel));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<CriticalLevelMgm>>) {
        result.subscribe((res: HttpResponse<CriticalLevelMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CriticalLevelMgm) {
        this.eventManager.broadcast({ name: 'criticalLevelListModification', content: 'OK'});
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
    selector: 'jhi-critical-level-mgm-popup',
    template: ''
})
export class CriticalLevelMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private criticalLevelPopupService: CriticalLevelMgmPopupService,
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
                    this.criticalLevelPopupService
                        .open(CriticalLevelMgmDialogComponent as Component, params['id']);
                } else {
                    this.criticalLevelPopupService
                        .open(CriticalLevelMgmDialogComponent as Component);
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
