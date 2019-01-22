import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AttackCostParamMgm } from './attack-cost-param-mgm.model';
import { AttackCostParamMgmPopupService } from './attack-cost-param-mgm-popup.service';
import { AttackCostParamMgmService } from './attack-cost-param-mgm.service';

@Component({
    selector: 'jhi-attack-cost-param-mgm-delete-dialog',
    templateUrl: './attack-cost-param-mgm-delete-dialog.component.html'
})
export class AttackCostParamMgmDeleteDialogComponent {

    attackCostParam: AttackCostParamMgm;

    constructor(
        private attackCostParamService: AttackCostParamMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.attackCostParamService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'attackCostParamListModification',
                content: 'Deleted an attackCostParam'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-attack-cost-param-mgm-delete-popup',
    template: ''
})
export class AttackCostParamMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private attackCostParamPopupService: AttackCostParamMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.attackCostParamPopupService
                .open(AttackCostParamMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
