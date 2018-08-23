import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CriticalLevelMgm } from './critical-level-mgm.model';
import { CriticalLevelMgmPopupService } from './critical-level-mgm-popup.service';
import { CriticalLevelMgmService } from './critical-level-mgm.service';

@Component({
    selector: 'jhi-critical-level-mgm-delete-dialog',
    templateUrl: './critical-level-mgm-delete-dialog.component.html'
})
export class CriticalLevelMgmDeleteDialogComponent {

    criticalLevel: CriticalLevelMgm;

    constructor(
        private criticalLevelService: CriticalLevelMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.criticalLevelService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'criticalLevelListModification',
                content: 'Deleted an criticalLevel'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-critical-level-mgm-delete-popup',
    template: ''
})
export class CriticalLevelMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private criticalLevelPopupService: CriticalLevelMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.criticalLevelPopupService
                .open(CriticalLevelMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
