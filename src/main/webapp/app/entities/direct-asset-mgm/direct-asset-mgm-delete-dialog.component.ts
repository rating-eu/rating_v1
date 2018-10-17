import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {DirectAssetMgm} from './direct-asset-mgm.model';
import {DirectAssetMgmPopupService} from './direct-asset-mgm-popup.service';
import {DirectAssetMgmService} from './direct-asset-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-direct-asset-mgm-delete-dialog',
    templateUrl: './direct-asset-mgm-delete-dialog.component.html'
})
export class DirectAssetMgmDeleteDialogComponent {

    directAsset: DirectAssetMgm;

    constructor(
        private directAssetService: DirectAssetMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.directAssetService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'directAssetListModification',
                content: 'Deleted an directAsset'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-direct-asset-mgm-delete-popup',
    template: ''
})
export class DirectAssetMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private directAssetPopupService: DirectAssetMgmPopupService,
        private popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.directAssetPopupService
                    .open(DirectAssetMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
