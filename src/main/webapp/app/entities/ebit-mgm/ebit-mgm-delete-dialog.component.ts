import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {EBITMgm} from './ebit-mgm.model';
import {EBITMgmPopupService} from './ebit-mgm-popup.service';
import {EBITMgmService} from './ebit-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-ebit-mgm-delete-dialog',
    templateUrl: './ebit-mgm-delete-dialog.component.html'
})
export class EBITMgmDeleteDialogComponent {

    eBIT: EBITMgm;

    constructor(
        private eBITService: EBITMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.eBITService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'eBITListModification',
                content: 'Deleted an eBIT'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-ebit-mgm-delete-popup',
    template: ''
})
export class EBITMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eBITPopupService: EBITMgmPopupService,
        private popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.eBITPopupService
                    .open(EBITMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
