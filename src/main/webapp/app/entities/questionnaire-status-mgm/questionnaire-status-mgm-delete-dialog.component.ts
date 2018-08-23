import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionnaireStatusMgm } from './questionnaire-status-mgm.model';
import { QuestionnaireStatusMgmPopupService } from './questionnaire-status-mgm-popup.service';
import { QuestionnaireStatusMgmService } from './questionnaire-status-mgm.service';

@Component({
    selector: 'jhi-questionnaire-status-mgm-delete-dialog',
    templateUrl: './questionnaire-status-mgm-delete-dialog.component.html'
})
export class QuestionnaireStatusMgmDeleteDialogComponent {

    questionnaireStatus: QuestionnaireStatusMgm;

    constructor(
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionnaireStatusService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionnaireStatusListModification',
                content: 'Deleted an questionnaireStatus'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-questionnaire-status-mgm-delete-popup',
    template: ''
})
export class QuestionnaireStatusMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionnaireStatusPopupService: QuestionnaireStatusMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.questionnaireStatusPopupService
                .open(QuestionnaireStatusMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
