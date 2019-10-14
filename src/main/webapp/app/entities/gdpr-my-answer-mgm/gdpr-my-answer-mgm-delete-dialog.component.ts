import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { GDPRMyAnswerMgm } from './gdpr-my-answer-mgm.model';
import { GDPRMyAnswerMgmPopupService } from './gdpr-my-answer-mgm-popup.service';
import { GDPRMyAnswerMgmService } from './gdpr-my-answer-mgm.service';

@Component({
    selector: 'jhi-gdpr-my-answer-mgm-delete-dialog',
    templateUrl: './gdpr-my-answer-mgm-delete-dialog.component.html'
})
export class GDPRMyAnswerMgmDeleteDialogComponent {

    gDPRMyAnswer: GDPRMyAnswerMgm;

    constructor(
        private gDPRMyAnswerService: GDPRMyAnswerMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.gDPRMyAnswerService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'gDPRMyAnswerListModification',
                content: 'Deleted an gDPRMyAnswer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-gdpr-my-answer-mgm-delete-popup',
    template: ''
})
export class GDPRMyAnswerMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private gDPRMyAnswerPopupService: GDPRMyAnswerMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.gDPRMyAnswerPopupService
                .open(GDPRMyAnswerMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
