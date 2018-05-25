import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LevelMgm } from './level-mgm.model';
import { LevelMgmPopupService } from './level-mgm-popup.service';
import { LevelMgmService } from './level-mgm.service';
import { AttackStrategyMgm, AttackStrategyMgmService } from '../attack-strategy-mgm';

@Component({
    selector: 'jhi-level-mgm-dialog',
    templateUrl: './level-mgm-dialog.component.html'
})
export class LevelMgmDialogComponent implements OnInit {

    level: LevelMgm;
    isSaving: boolean;

    attackstrategies: AttackStrategyMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private levelService: LevelMgmService,
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
        if (this.level.id !== undefined) {
            this.subscribeToSaveResponse(
                this.levelService.update(this.level));
        } else {
            this.subscribeToSaveResponse(
                this.levelService.create(this.level));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LevelMgm>>) {
        result.subscribe((res: HttpResponse<LevelMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LevelMgm) {
        this.eventManager.broadcast({ name: 'levelListModification', content: 'OK'});
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
    selector: 'jhi-level-mgm-popup',
    template: ''
})
export class LevelMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private levelPopupService: LevelMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.levelPopupService
                    .open(LevelMgmDialogComponent as Component, params['id']);
            } else {
                this.levelPopupService
                    .open(LevelMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
