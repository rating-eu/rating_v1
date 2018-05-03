import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { PhaseWrapperMgm } from './phase-wrapper-mgm.model';
import { PhaseWrapperMgmPopupService } from './phase-wrapper-mgm-popup.service';
import { PhaseWrapperMgmService } from './phase-wrapper-mgm.service';

@Component({
    selector: 'jhi-phase-wrapper-mgm-delete-dialog',
    templateUrl: './phase-wrapper-mgm-delete-dialog.component.html'
})
export class PhaseWrapperMgmDeleteDialogComponent {

    phaseWrapper: PhaseWrapperMgm;

    constructor(
        private phaseWrapperService: PhaseWrapperMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.phaseWrapperService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'phaseWrapperListModification',
                content: 'Deleted an phaseWrapper'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-phase-wrapper-mgm-delete-popup',
    template: ''
})
export class PhaseWrapperMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private phaseWrapperPopupService: PhaseWrapperMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.phaseWrapperPopupService
                .open(PhaseWrapperMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
