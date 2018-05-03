import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LevelWrapperMgm } from './level-wrapper-mgm.model';
import { LevelWrapperMgmPopupService } from './level-wrapper-mgm-popup.service';
import { LevelWrapperMgmService } from './level-wrapper-mgm.service';
import { AttackStrategyMgm, AttackStrategyMgmService } from '../attack-strategy-mgm';

@Component({
    selector: 'jhi-level-wrapper-mgm-dialog',
    templateUrl: './level-wrapper-mgm-dialog.component.html'
})
export class LevelWrapperMgmDialogComponent implements OnInit {

    levelWrapper: LevelWrapperMgm;
    isSaving: boolean;

    attackstrategies: AttackStrategyMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private levelWrapperService: LevelWrapperMgmService,
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
        if (this.levelWrapper.id !== undefined) {
            this.subscribeToSaveResponse(
                this.levelWrapperService.update(this.levelWrapper));
        } else {
            this.subscribeToSaveResponse(
                this.levelWrapperService.create(this.levelWrapper));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LevelWrapperMgm>>) {
        result.subscribe((res: HttpResponse<LevelWrapperMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LevelWrapperMgm) {
        this.eventManager.broadcast({ name: 'levelWrapperListModification', content: 'OK'});
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
    selector: 'jhi-level-wrapper-mgm-popup',
    template: ''
})
export class LevelWrapperMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private levelWrapperPopupService: LevelWrapperMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.levelWrapperPopupService
                    .open(LevelWrapperMgmDialogComponent as Component, params['id']);
            } else {
                this.levelWrapperPopupService
                    .open(LevelWrapperMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
