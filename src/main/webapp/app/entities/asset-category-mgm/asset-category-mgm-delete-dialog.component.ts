import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AssetCategoryMgm } from './asset-category-mgm.model';
import { AssetCategoryMgmPopupService } from './asset-category-mgm-popup.service';
import { AssetCategoryMgmService } from './asset-category-mgm.service';

@Component({
    selector: 'jhi-asset-category-mgm-delete-dialog',
    templateUrl: './asset-category-mgm-delete-dialog.component.html'
})
export class AssetCategoryMgmDeleteDialogComponent {

    assetCategory: AssetCategoryMgm;

    constructor(
        private assetCategoryService: AssetCategoryMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.assetCategoryService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'assetCategoryListModification',
                content: 'Deleted an assetCategory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-asset-category-mgm-delete-popup',
    template: ''
})
export class AssetCategoryMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private assetCategoryPopupService: AssetCategoryMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.assetCategoryPopupService
                .open(AssetCategoryMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
