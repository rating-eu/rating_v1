import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRQuestionMgm } from './gdpr-question-mgm.model';
import { GDPRQuestionMgmPopupService } from './gdpr-question-mgm-popup.service';
import { GDPRQuestionMgmService } from './gdpr-question-mgm.service';

@Component({
    selector: 'jhi-gdpr-question-mgm-delete-dialog',
    templateUrl: './gdpr-question-mgm-delete-dialog.component.html'
})
export class GDPRQuestionMgmDeleteDialogComponent {

    gDPRQuestion: GDPRQuestionMgm;

    constructor(
        private gDPRQuestionService: GDPRQuestionMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.gDPRQuestionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'gDPRQuestionListModification',
                content: 'Deleted an gDPRQuestion'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-gdpr-question-mgm-delete-popup',
    template: ''
})
export class GDPRQuestionMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRQuestionPopupService: GDPRQuestionMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.gDPRQuestionPopupService
                .open(GDPRQuestionMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
