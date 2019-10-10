import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { OverallDataRiskMgm } from './overall-data-risk-mgm.model';
import { OverallDataRiskMgmPopupService } from './overall-data-risk-mgm-popup.service';
import { OverallDataRiskMgmService } from './overall-data-risk-mgm.service';

@Component({
    selector: 'jhi-overall-data-risk-mgm-delete-dialog',
    templateUrl: './overall-data-risk-mgm-delete-dialog.component.html'
})
export class OverallDataRiskMgmDeleteDialogComponent {

    overallDataRisk: OverallDataRiskMgm;

    constructor(
        private overallDataRiskService: OverallDataRiskMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.overallDataRiskService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'overallDataRiskListModification',
                content: 'Deleted an overallDataRisk'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-overall-data-risk-mgm-delete-popup',
    template: ''
})
export class OverallDataRiskMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private overallDataRiskPopupService: OverallDataRiskMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.overallDataRiskPopupService
                .open(OverallDataRiskMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
