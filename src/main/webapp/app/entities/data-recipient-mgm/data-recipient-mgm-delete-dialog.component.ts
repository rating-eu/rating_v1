import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DataRecipientMgm } from './data-recipient-mgm.model';
import { DataRecipientMgmPopupService } from './data-recipient-mgm-popup.service';
import { DataRecipientMgmService } from './data-recipient-mgm.service';

@Component({
    selector: 'jhi-data-recipient-mgm-delete-dialog',
    templateUrl: './data-recipient-mgm-delete-dialog.component.html'
})
export class DataRecipientMgmDeleteDialogComponent {

    dataRecipient: DataRecipientMgm;

    constructor(
        private dataRecipientService: DataRecipientMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.dataRecipientService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'dataRecipientListModification',
                content: 'Deleted an dataRecipient'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-data-recipient-mgm-delete-popup',
    template: ''
})
export class DataRecipientMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataRecipientPopupService: DataRecipientMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.dataRecipientPopupService
                .open(DataRecipientMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
