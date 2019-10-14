import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRQuestionnaireMgm } from './gdpr-questionnaire-mgm.model';
import { GDPRQuestionnaireMgmPopupService } from './gdpr-questionnaire-mgm-popup.service';
import { GDPRQuestionnaireMgmService } from './gdpr-questionnaire-mgm.service';

@Component({
    selector: 'jhi-gdpr-questionnaire-mgm-delete-dialog',
    templateUrl: './gdpr-questionnaire-mgm-delete-dialog.component.html'
})
export class GDPRQuestionnaireMgmDeleteDialogComponent {

    gDPRQuestionnaire: GDPRQuestionnaireMgm;

    constructor(
        private gDPRQuestionnaireService: GDPRQuestionnaireMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.gDPRQuestionnaireService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'gDPRQuestionnaireListModification',
                content: 'Deleted an gDPRQuestionnaire'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-gdpr-questionnaire-mgm-delete-popup',
    template: ''
})
export class GDPRQuestionnaireMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRQuestionnairePopupService: GDPRQuestionnaireMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.gDPRQuestionnairePopupService
                .open(GDPRQuestionnaireMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
