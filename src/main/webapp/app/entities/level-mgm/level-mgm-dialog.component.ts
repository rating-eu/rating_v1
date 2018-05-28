import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LevelMgm } from './level-mgm.model';
import { LevelMgmPopupService } from './level-mgm-popup.service';
import { LevelMgmService } from './level-mgm.service';

@Component({
    selector: 'jhi-level-mgm-dialog',
    templateUrl: './level-mgm-dialog.component.html'
})
export class LevelMgmDialogComponent implements OnInit {

    level: LevelMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private levelService: LevelMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
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
