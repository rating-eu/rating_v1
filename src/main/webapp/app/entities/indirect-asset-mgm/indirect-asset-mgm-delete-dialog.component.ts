import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IndirectAssetMgm } from './indirect-asset-mgm.model';
import { IndirectAssetMgmPopupService } from './indirect-asset-mgm-popup.service';
import { IndirectAssetMgmService } from './indirect-asset-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-indirect-asset-mgm-delete-dialog',
    templateUrl: './indirect-asset-mgm-delete-dialog.component.html'
})
export class IndirectAssetMgmDeleteDialogComponent {

    indirectAsset: IndirectAssetMgm;

    constructor(
        private indirectAssetService: IndirectAssetMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.indirectAssetService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'indirectAssetListModification',
                content: 'Deleted an indirectAsset'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-indirect-asset-mgm-delete-popup',
    template: ''
})
export class IndirectAssetMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private indirectAssetPopupService: IndirectAssetMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.indirectAssetPopupService
                    .open(IndirectAssetMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
