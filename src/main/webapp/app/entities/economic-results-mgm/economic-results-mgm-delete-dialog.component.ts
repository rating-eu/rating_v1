import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { EconomicResultsMgm } from './economic-results-mgm.model';
import { EconomicResultsMgmPopupService } from './economic-results-mgm-popup.service';
import { EconomicResultsMgmService } from './economic-results-mgm.service';

@Component({
    selector: 'jhi-economic-results-mgm-delete-dialog',
    templateUrl: './economic-results-mgm-delete-dialog.component.html'
})
export class EconomicResultsMgmDeleteDialogComponent {

    economicResults: EconomicResultsMgm;

    constructor(
        private economicResultsService: EconomicResultsMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.economicResultsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'economicResultsListModification',
                content: 'Deleted an economicResults'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-economic-results-mgm-delete-popup',
    template: ''
})
export class EconomicResultsMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private economicResultsPopupService: EconomicResultsMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.economicResultsPopupService
                .open(EconomicResultsMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
