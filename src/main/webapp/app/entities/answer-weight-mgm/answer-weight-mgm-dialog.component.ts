import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AnswerWeightMgm } from './answer-weight-mgm.model';
import { AnswerWeightMgmPopupService } from './answer-weight-mgm-popup.service';
import { AnswerWeightMgmService } from './answer-weight-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-answer-weight-mgm-dialog',
    templateUrl: './answer-weight-mgm-dialog.component.html'
})
export class AnswerWeightMgmDialogComponent implements OnInit {

    answerWeight: AnswerWeightMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private answerWeightService: AnswerWeightMgmService,
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
        if (this.answerWeight.id !== undefined) {
            this.subscribeToSaveResponse(
                this.answerWeightService.update(this.answerWeight));
        } else {
            this.subscribeToSaveResponse(
                this.answerWeightService.create(this.answerWeight));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<AnswerWeightMgm>>) {
        result.subscribe((res: HttpResponse<AnswerWeightMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: AnswerWeightMgm) {
        this.eventManager.broadcast({ name: 'answerWeightListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-answer-weight-mgm-popup',
    template: ''
})
export class AnswerWeightMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private answerWeightPopupService: AnswerWeightMgmPopupService,
        private popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.answerWeightPopupService
                        .open(AnswerWeightMgmDialogComponent as Component, params['id']);
                } else {
                    this.answerWeightPopupService
                        .open(AnswerWeightMgmDialogComponent as Component);
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
