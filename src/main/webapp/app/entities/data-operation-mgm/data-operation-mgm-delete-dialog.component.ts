import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DataOperationMgm } from './data-operation-mgm.model';
import { DataOperationMgmPopupService } from './data-operation-mgm-popup.service';
import { DataOperationMgmService } from './data-operation-mgm.service';

@Component({
    selector: 'jhi-data-operation-mgm-delete-dialog',
    templateUrl: './data-operation-mgm-delete-dialog.component.html'
})
export class DataOperationMgmDeleteDialogComponent {

    dataOperation: DataOperationMgm;

    constructor(
        private dataOperationService: DataOperationMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.dataOperationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'dataOperationListModification',
                content: 'Deleted an dataOperation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-data-operation-mgm-delete-popup',
    template: ''
})
export class DataOperationMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataOperationPopupService: DataOperationMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.dataOperationPopupService
                .open(DataOperationMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
