import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PhaseMgm } from './phase-mgm.model';
import { PhaseMgmPopupService } from './phase-mgm-popup.service';
import { PhaseMgmService } from './phase-mgm.service';
import { AttackStrategyMgm, AttackStrategyMgmService } from '../attack-strategy-mgm';

@Component({
    selector: 'jhi-phase-mgm-dialog',
    templateUrl: './phase-mgm-dialog.component.html'
})
export class PhaseMgmDialogComponent implements OnInit {

    phase: PhaseMgm;
    isSaving: boolean;

    attackstrategies: AttackStrategyMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private phaseService: PhaseMgmService,
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
        if (this.phase.id !== undefined) {
            this.subscribeToSaveResponse(
                this.phaseService.update(this.phase));
        } else {
            this.subscribeToSaveResponse(
                this.phaseService.create(this.phase));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<PhaseMgm>>) {
        result.subscribe((res: HttpResponse<PhaseMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: PhaseMgm) {
        this.eventManager.broadcast({ name: 'phaseListModification', content: 'OK'});
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
    selector: 'jhi-phase-mgm-popup',
    template: ''
})
export class PhaseMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private phasePopupService: PhaseMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.phasePopupService
                    .open(PhaseMgmDialogComponent as Component, params['id']);
            } else {
                this.phasePopupService
                    .open(PhaseMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
