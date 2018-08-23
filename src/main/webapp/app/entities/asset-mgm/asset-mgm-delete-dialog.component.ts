import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AssetMgm } from './asset-mgm.model';
import { AssetMgmPopupService } from './asset-mgm-popup.service';
import { AssetMgmService } from './asset-mgm.service';

@Component({
    selector: 'jhi-asset-mgm-delete-dialog',
    templateUrl: './asset-mgm-delete-dialog.component.html'
})
export class AssetMgmDeleteDialogComponent {

    asset: AssetMgm;

    constructor(
        private assetService: AssetMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.assetService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'assetListModification',
                content: 'Deleted an asset'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-asset-mgm-delete-popup',
    template: ''
})
export class AssetMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private assetPopupService: AssetMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.assetPopupService
                .open(AssetMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
