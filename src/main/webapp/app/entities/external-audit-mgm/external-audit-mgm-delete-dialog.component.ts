import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ExternalAuditMgm } from './external-audit-mgm.model';
import { ExternalAuditMgmPopupService } from './external-audit-mgm-popup.service';
import { ExternalAuditMgmService } from './external-audit-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-external-audit-mgm-delete-dialog',
    templateUrl: './external-audit-mgm-delete-dialog.component.html'
})
export class ExternalAuditMgmDeleteDialogComponent {

    externalAudit: ExternalAuditMgm;

    constructor(
        private externalAuditService: ExternalAuditMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.externalAuditService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'externalAuditListModification',
                content: 'Deleted an externalAudit'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-external-audit-mgm-delete-popup',
    template: ''
})
export class ExternalAuditMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private externalAuditPopupService: ExternalAuditMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.externalAuditPopupService
                    .open(ExternalAuditMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
