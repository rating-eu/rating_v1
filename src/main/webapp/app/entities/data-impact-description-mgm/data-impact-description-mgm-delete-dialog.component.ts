import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DataImpactDescriptionMgm } from './data-impact-description-mgm.model';
import { DataImpactDescriptionMgmPopupService } from './data-impact-description-mgm-popup.service';
import { DataImpactDescriptionMgmService } from './data-impact-description-mgm.service';

@Component({
    selector: 'jhi-data-impact-description-mgm-delete-dialog',
    templateUrl: './data-impact-description-mgm-delete-dialog.component.html'
})
export class DataImpactDescriptionMgmDeleteDialogComponent {

    dataImpactDescription: DataImpactDescriptionMgm;

    constructor(
        private dataImpactDescriptionService: DataImpactDescriptionMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.dataImpactDescriptionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'dataImpactDescriptionListModification',
                content: 'Deleted an dataImpactDescription'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-data-impact-description-mgm-delete-popup',
    template: ''
})
export class DataImpactDescriptionMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataImpactDescriptionPopupService: DataImpactDescriptionMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.dataImpactDescriptionPopupService
                .open(DataImpactDescriptionMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
