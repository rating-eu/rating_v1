import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { MotivationMgm } from './motivation-mgm.model';
import { MotivationMgmPopupService } from './motivation-mgm-popup.service';
import { MotivationMgmService } from './motivation-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-motivation-mgm-dialog',
    templateUrl: './motivation-mgm-dialog.component.html'
})
export class MotivationMgmDialogComponent implements OnInit {

    motivation: MotivationMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private motivationService: MotivationMgmService,
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
        if (this.motivation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.motivationService.update(this.motivation));
        } else {
            this.subscribeToSaveResponse(
                this.motivationService.create(this.motivation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MotivationMgm>>) {
        result.subscribe((res: HttpResponse<MotivationMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MotivationMgm) {
        this.eventManager.broadcast({ name: 'motivationListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-motivation-mgm-popup',
    template: ''
})
export class MotivationMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private motivationPopupService: MotivationMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.motivationPopupService
                        .open(MotivationMgmDialogComponent as Component, params['id']);
                } else {
                    this.motivationPopupService
                        .open(MotivationMgmDialogComponent as Component);
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
