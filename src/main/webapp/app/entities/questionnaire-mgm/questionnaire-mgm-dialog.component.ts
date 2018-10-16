import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionnaireMgm } from './questionnaire-mgm.model';
import { QuestionnaireMgmPopupService } from './questionnaire-mgm-popup.service';
import { QuestionnaireMgmService } from './questionnaire-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-questionnaire-mgm-dialog',
    templateUrl: './questionnaire-mgm-dialog.component.html'
})
export class QuestionnaireMgmDialogComponent implements OnInit {

    questionnaire: QuestionnaireMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private questionnaireService: QuestionnaireMgmService,
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
        if (this.questionnaire.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionnaireService.update(this.questionnaire));
        } else {
            this.subscribeToSaveResponse(
                this.questionnaireService.create(this.questionnaire));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionnaireMgm>>) {
        result.subscribe((res: HttpResponse<QuestionnaireMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionnaireMgm) {
        this.eventManager.broadcast({ name: 'questionnaireListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-questionnaire-mgm-popup',
    template: ''
})
export class QuestionnaireMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionnairePopupService: QuestionnaireMgmPopupService,
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
                    this.questionnairePopupService
                        .open(QuestionnaireMgmDialogComponent as Component, params['id']);
                } else {
                    this.questionnairePopupService
                        .open(QuestionnaireMgmDialogComponent as Component);
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
