import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AttackCostMgm } from './attack-cost-mgm.model';
import { AttackCostMgmPopupService } from './attack-cost-mgm-popup.service';
import { AttackCostMgmService } from './attack-cost-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-attack-cost-mgm-delete-dialog',
    templateUrl: './attack-cost-mgm-delete-dialog.component.html'
})
export class AttackCostMgmDeleteDialogComponent {

    attackCost: AttackCostMgm;

    constructor(
        private attackCostService: AttackCostMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.attackCostService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'attackCostListModification',
                content: 'Deleted an attackCost'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-attack-cost-mgm-delete-popup',
    template: ''
})
export class AttackCostMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private attackCostPopupService: AttackCostMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.attackCostPopupService
                    .open(AttackCostMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
