import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { MyAssetMgm } from './my-asset-mgm.model';
import { MyAssetMgmPopupService } from './my-asset-mgm-popup.service';
import { MyAssetMgmService } from './my-asset-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-my-asset-mgm-delete-dialog',
    templateUrl: './my-asset-mgm-delete-dialog.component.html'
})
export class MyAssetMgmDeleteDialogComponent {

    myAsset: MyAssetMgm;

    constructor(
        private myAssetService: MyAssetMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.myAssetService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'myAssetListModification',
                content: 'Deleted an myAsset'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-my-asset-mgm-delete-popup',
    template: ''
})
export class MyAssetMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myAssetPopupService: MyAssetMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.myAssetPopupService
                    .open(MyAssetMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
