import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { MitigationMgm } from './mitigation-mgm.model';
import { MitigationMgmPopupService } from './mitigation-mgm-popup.service';
import { MitigationMgmService } from './mitigation-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-mitigation-mgm-delete-dialog',
    templateUrl: './mitigation-mgm-delete-dialog.component.html'
})
export class MitigationMgmDeleteDialogComponent {

    mitigation: MitigationMgm;

    constructor(
        private mitigationService: MitigationMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.mitigationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'mitigationListModification',
                content: 'Deleted an mitigation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-mitigation-mgm-delete-popup',
    template: ''
})
export class MitigationMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private mitigationPopupService: MitigationMgmPopupService,
        private popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.mitigationPopupService
                    .open(MitigationMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
