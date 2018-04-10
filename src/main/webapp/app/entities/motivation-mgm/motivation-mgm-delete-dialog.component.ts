import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { MotivationMgm } from './motivation-mgm.model';
import { MotivationMgmPopupService } from './motivation-mgm-popup.service';
import { MotivationMgmService } from './motivation-mgm.service';

@Component({
    selector: 'jhi-motivation-mgm-delete-dialog',
    templateUrl: './motivation-mgm-delete-dialog.component.html'
})
export class MotivationMgmDeleteDialogComponent {

    motivation: MotivationMgm;

    constructor(
        private motivationService: MotivationMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.motivationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'motivationListModification',
                content: 'Deleted an motivation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-motivation-mgm-delete-popup',
    template: ''
})
export class MotivationMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private motivationPopupService: MotivationMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.motivationPopupService
                .open(MotivationMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
