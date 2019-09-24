import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DataThreatMgm } from './data-threat-mgm.model';
import { DataThreatMgmPopupService } from './data-threat-mgm-popup.service';
import { DataThreatMgmService } from './data-threat-mgm.service';

@Component({
    selector: 'jhi-data-threat-mgm-delete-dialog',
    templateUrl: './data-threat-mgm-delete-dialog.component.html'
})
export class DataThreatMgmDeleteDialogComponent {

    dataThreat: DataThreatMgm;

    constructor(
        private dataThreatService: DataThreatMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.dataThreatService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'dataThreatListModification',
                content: 'Deleted an dataThreat'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-data-threat-mgm-delete-popup',
    template: ''
})
export class DataThreatMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataThreatPopupService: DataThreatMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.dataThreatPopupService
                .open(DataThreatMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
