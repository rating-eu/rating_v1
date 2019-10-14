import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRQuestionnaireStatusMgm } from './gdpr-questionnaire-status-mgm.model';
import { GDPRQuestionnaireStatusMgmPopupService } from './gdpr-questionnaire-status-mgm-popup.service';
import { GDPRQuestionnaireStatusMgmService } from './gdpr-questionnaire-status-mgm.service';

@Component({
    selector: 'jhi-gdpr-questionnaire-status-mgm-delete-dialog',
    templateUrl: './gdpr-questionnaire-status-mgm-delete-dialog.component.html'
})
export class GDPRQuestionnaireStatusMgmDeleteDialogComponent {

    gDPRQuestionnaireStatus: GDPRQuestionnaireStatusMgm;

    constructor(
        private gDPRQuestionnaireStatusService: GDPRQuestionnaireStatusMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.gDPRQuestionnaireStatusService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'gDPRQuestionnaireStatusListModification',
                content: 'Deleted an gDPRQuestionnaireStatus'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-gdpr-questionnaire-status-mgm-delete-popup',
    template: ''
})
export class GDPRQuestionnaireStatusMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRQuestionnaireStatusPopupService: GDPRQuestionnaireStatusMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.gDPRQuestionnaireStatusPopupService
                .open(GDPRQuestionnaireStatusMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
