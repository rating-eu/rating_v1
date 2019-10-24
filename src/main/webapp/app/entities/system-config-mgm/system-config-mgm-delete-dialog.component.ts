import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SystemConfigMgm } from './system-config-mgm.model';
import { SystemConfigMgmPopupService } from './system-config-mgm-popup.service';
import { SystemConfigMgmService } from './system-config-mgm.service';

@Component({
    selector: 'jhi-system-config-mgm-delete-dialog',
    templateUrl: './system-config-mgm-delete-dialog.component.html'
})
export class SystemConfigMgmDeleteDialogComponent {

    systemConfig: SystemConfigMgm;

    constructor(
        private systemConfigService: SystemConfigMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.systemConfigService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'systemConfigListModification',
                content: 'Deleted an systemConfig'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-system-config-mgm-delete-popup',
    template: ''
})
export class SystemConfigMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private systemConfigPopupService: SystemConfigMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.systemConfigPopupService
                .open(SystemConfigMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
