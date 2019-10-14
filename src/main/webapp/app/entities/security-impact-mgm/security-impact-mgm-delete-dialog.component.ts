import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SecurityImpactMgm } from './security-impact-mgm.model';
import { SecurityImpactMgmPopupService } from './security-impact-mgm-popup.service';
import { SecurityImpactMgmService } from './security-impact-mgm.service';

@Component({
    selector: 'jhi-security-impact-mgm-delete-dialog',
    templateUrl: './security-impact-mgm-delete-dialog.component.html'
})
export class SecurityImpactMgmDeleteDialogComponent {

    securityImpact: SecurityImpactMgm;

    constructor(
        private securityImpactService: SecurityImpactMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.securityImpactService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'securityImpactListModification',
                content: 'Deleted an securityImpact'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-security-impact-mgm-delete-popup',
    template: ''
})
export class SecurityImpactMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private securityImpactPopupService: SecurityImpactMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.securityImpactPopupService
                .open(SecurityImpactMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
