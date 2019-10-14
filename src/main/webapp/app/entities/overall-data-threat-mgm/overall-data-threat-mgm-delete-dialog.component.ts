import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { OverallDataThreatMgm } from './overall-data-threat-mgm.model';
import { OverallDataThreatMgmPopupService } from './overall-data-threat-mgm-popup.service';
import { OverallDataThreatMgmService } from './overall-data-threat-mgm.service';

@Component({
    selector: 'jhi-overall-data-threat-mgm-delete-dialog',
    templateUrl: './overall-data-threat-mgm-delete-dialog.component.html'
})
export class OverallDataThreatMgmDeleteDialogComponent {

    overallDataThreat: OverallDataThreatMgm;

    constructor(
        private overallDataThreatService: OverallDataThreatMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.overallDataThreatService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'overallDataThreatListModification',
                content: 'Deleted an overallDataThreat'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-overall-data-threat-mgm-delete-popup',
    template: ''
})
export class OverallDataThreatMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private overallDataThreatPopupService: OverallDataThreatMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.overallDataThreatPopupService
                .open(OverallDataThreatMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
