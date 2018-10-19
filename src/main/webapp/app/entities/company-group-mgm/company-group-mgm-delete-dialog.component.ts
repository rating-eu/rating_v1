import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {CompanyGroupMgm} from './company-group-mgm.model';
import {CompanyGroupMgmPopupService} from './company-group-mgm-popup.service';
import {CompanyGroupMgmService} from './company-group-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-company-group-mgm-delete-dialog',
    templateUrl: './company-group-mgm-delete-dialog.component.html'
})
export class CompanyGroupMgmDeleteDialogComponent {

    companyGroup: CompanyGroupMgm;

    constructor(
        private companyGroupService: CompanyGroupMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.companyGroupService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'companyGroupListModification',
                content: 'Deleted an companyGroup'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-company-group-mgm-delete-popup',
    template: ''
})
export class CompanyGroupMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private companyGroupPopupService: CompanyGroupMgmPopupService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.companyGroupPopupService
                    .open(CompanyGroupMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
