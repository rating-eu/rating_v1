import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { OverallSecurityImpactMgm } from './overall-security-impact-mgm.model';
import { OverallSecurityImpactMgmPopupService } from './overall-security-impact-mgm-popup.service';
import { OverallSecurityImpactMgmService } from './overall-security-impact-mgm.service';

@Component({
    selector: 'jhi-overall-security-impact-mgm-delete-dialog',
    templateUrl: './overall-security-impact-mgm-delete-dialog.component.html'
})
export class OverallSecurityImpactMgmDeleteDialogComponent {

    overallSecurityImpact: OverallSecurityImpactMgm;

    constructor(
        private overallSecurityImpactService: OverallSecurityImpactMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.overallSecurityImpactService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'overallSecurityImpactListModification',
                content: 'Deleted an overallSecurityImpact'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-overall-security-impact-mgm-delete-popup',
    template: ''
})
export class OverallSecurityImpactMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private overallSecurityImpactPopupService: OverallSecurityImpactMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.overallSecurityImpactPopupService
                .open(OverallSecurityImpactMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
