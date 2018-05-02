import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PhaseWrapperMgm } from './phase-wrapper-mgm.model';
import { PhaseWrapperMgmPopupService } from './phase-wrapper-mgm-popup.service';
import { PhaseWrapperMgmService } from './phase-wrapper-mgm.service';
import { AttackStrategyMgm, AttackStrategyMgmService } from '../attack-strategy-mgm';

@Component({
    selector: 'jhi-phase-wrapper-mgm-dialog',
    templateUrl: './phase-wrapper-mgm-dialog.component.html'
})
export class PhaseWrapperMgmDialogComponent implements OnInit {

    phaseWrapper: PhaseWrapperMgm;
    isSaving: boolean;

    attackstrategies: AttackStrategyMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private phaseWrapperService: PhaseWrapperMgmService,
        private attackStrategyService: AttackStrategyMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.attackStrategyService.query()
            .subscribe((res: HttpResponse<AttackStrategyMgm[]>) => { this.attackstrategies = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.phaseWrapper.id !== undefined) {
            this.subscribeToSaveResponse(
                this.phaseWrapperService.update(this.phaseWrapper));
        } else {
            this.subscribeToSaveResponse(
                this.phaseWrapperService.create(this.phaseWrapper));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<PhaseWrapperMgm>>) {
        result.subscribe((res: HttpResponse<PhaseWrapperMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: PhaseWrapperMgm) {
        this.eventManager.broadcast({ name: 'phaseWrapperListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackAttackStrategyById(index: number, item: AttackStrategyMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-phase-wrapper-mgm-popup',
    template: ''
})
export class PhaseWrapperMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private phaseWrapperPopupService: PhaseWrapperMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.phaseWrapperPopupService
                    .open(PhaseWrapperMgmDialogComponent as Component, params['id']);
            } else {
                this.phaseWrapperPopupService
                    .open(PhaseWrapperMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
