import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MitigationMgm } from './mitigation-mgm.model';
import { MitigationMgmPopupService } from './mitigation-mgm-popup.service';
import { MitigationMgmService } from './mitigation-mgm.service';
import { AttackStrategyMgm, AttackStrategyMgmService } from '../attack-strategy-mgm';

@Component({
    selector: 'jhi-mitigation-mgm-dialog',
    templateUrl: './mitigation-mgm-dialog.component.html'
})
export class MitigationMgmDialogComponent implements OnInit {

    mitigation: MitigationMgm;
    isSaving: boolean;

    attackstrategies: AttackStrategyMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private mitigationService: MitigationMgmService,
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
        if (this.mitigation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.mitigationService.update(this.mitigation));
        } else {
            this.subscribeToSaveResponse(
                this.mitigationService.create(this.mitigation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MitigationMgm>>) {
        result.subscribe((res: HttpResponse<MitigationMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MitigationMgm) {
        this.eventManager.broadcast({ name: 'mitigationListModification', content: 'OK'});
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

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-mitigation-mgm-popup',
    template: ''
})
export class MitigationMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private mitigationPopupService: MitigationMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.mitigationPopupService
                    .open(MitigationMgmDialogComponent as Component, params['id']);
            } else {
                this.mitigationPopupService
                    .open(MitigationMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
