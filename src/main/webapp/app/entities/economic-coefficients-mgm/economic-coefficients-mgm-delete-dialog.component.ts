import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { EconomicCoefficientsMgm } from './economic-coefficients-mgm.model';
import { EconomicCoefficientsMgmPopupService } from './economic-coefficients-mgm-popup.service';
import { EconomicCoefficientsMgmService } from './economic-coefficients-mgm.service';

@Component({
    selector: 'jhi-economic-coefficients-mgm-delete-dialog',
    templateUrl: './economic-coefficients-mgm-delete-dialog.component.html'
})
export class EconomicCoefficientsMgmDeleteDialogComponent {

    economicCoefficients: EconomicCoefficientsMgm;

    constructor(
        private economicCoefficientsService: EconomicCoefficientsMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.economicCoefficientsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'economicCoefficientsListModification',
                content: 'Deleted an economicCoefficients'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-economic-coefficients-mgm-delete-popup',
    template: ''
})
export class EconomicCoefficientsMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private economicCoefficientsPopupService: EconomicCoefficientsMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.economicCoefficientsPopupService
                .open(EconomicCoefficientsMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
