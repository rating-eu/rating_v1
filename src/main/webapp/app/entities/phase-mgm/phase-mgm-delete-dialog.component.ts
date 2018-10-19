import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { PhaseMgm } from './phase-mgm.model';
import { PhaseMgmPopupService } from './phase-mgm-popup.service';
import { PhaseMgmService } from './phase-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-phase-mgm-delete-dialog',
    templateUrl: './phase-mgm-delete-dialog.component.html'
})
export class PhaseMgmDeleteDialogComponent {

    phase: PhaseMgm;

    constructor(
        private phaseService: PhaseMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.phaseService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'phaseListModification',
                content: 'Deleted an phase'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-phase-mgm-delete-popup',
    template: ''
})
export class PhaseMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private phasePopupService: PhaseMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.phasePopupService
                    .open(PhaseMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
