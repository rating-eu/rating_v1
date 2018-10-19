import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CompanyProfileMgm } from './company-profile-mgm.model';
import { CompanyProfileMgmPopupService } from './company-profile-mgm-popup.service';
import { CompanyProfileMgmService } from './company-profile-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-company-profile-mgm-delete-dialog',
    templateUrl: './company-profile-mgm-delete-dialog.component.html'
})
export class CompanyProfileMgmDeleteDialogComponent {

    companyProfile: CompanyProfileMgm;

    constructor(
        private companyProfileService: CompanyProfileMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.companyProfileService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'companyProfileListModification',
                content: 'Deleted an companyProfile'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-company-profile-mgm-delete-popup',
    template: ''
})
export class CompanyProfileMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private companyProfilePopupService: CompanyProfileMgmPopupService,
        private popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.companyProfilePopupService
                    .open(CompanyProfileMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
