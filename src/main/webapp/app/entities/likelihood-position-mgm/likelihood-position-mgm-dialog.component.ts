import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LikelihoodPositionMgm } from './likelihood-position-mgm.model';
import { LikelihoodPositionMgmPopupService } from './likelihood-position-mgm-popup.service';
import { LikelihoodPositionMgmService } from './likelihood-position-mgm.service';

@Component({
    selector: 'jhi-likelihood-position-mgm-dialog',
    templateUrl: './likelihood-position-mgm-dialog.component.html'
})
export class LikelihoodPositionMgmDialogComponent implements OnInit {

    likelihoodPosition: LikelihoodPositionMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private likelihoodPositionService: LikelihoodPositionMgmService,
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
        if (this.likelihoodPosition.id !== undefined) {
            this.subscribeToSaveResponse(
                this.likelihoodPositionService.update(this.likelihoodPosition));
        } else {
            this.subscribeToSaveResponse(
                this.likelihoodPositionService.create(this.likelihoodPosition));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LikelihoodPositionMgm>>) {
        result.subscribe((res: HttpResponse<LikelihoodPositionMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LikelihoodPositionMgm) {
        this.eventManager.broadcast({ name: 'likelihoodPositionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-likelihood-position-mgm-popup',
    template: ''
})
export class LikelihoodPositionMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private likelihoodPositionPopupService: LikelihoodPositionMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.likelihoodPositionPopupService
                    .open(LikelihoodPositionMgmDialogComponent as Component, params['id']);
            } else {
                this.likelihoodPositionPopupService
                    .open(LikelihoodPositionMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
