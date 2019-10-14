import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRAnswerMgm } from './gdpr-answer-mgm.model';
import { GDPRAnswerMgmPopupService } from './gdpr-answer-mgm-popup.service';
import { GDPRAnswerMgmService } from './gdpr-answer-mgm.service';

@Component({
    selector: 'jhi-gdpr-answer-mgm-delete-dialog',
    templateUrl: './gdpr-answer-mgm-delete-dialog.component.html'
})
export class GDPRAnswerMgmDeleteDialogComponent {

    gDPRAnswer: GDPRAnswerMgm;

    constructor(
        private gDPRAnswerService: GDPRAnswerMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.gDPRAnswerService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'gDPRAnswerListModification',
                content: 'Deleted an gDPRAnswer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-gdpr-answer-mgm-delete-popup',
    template: ''
})
export class GDPRAnswerMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRAnswerPopupService: GDPRAnswerMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.gDPRAnswerPopupService
                .open(GDPRAnswerMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
