import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AttackStrategyMgm } from './attack-strategy-mgm.model';
import { AttackStrategyMgmPopupService } from './attack-strategy-mgm-popup.service';
import { AttackStrategyMgmService } from './attack-strategy-mgm.service';

@Component({
    selector: 'jhi-attack-strategy-mgm-delete-dialog',
    templateUrl: './attack-strategy-mgm-delete-dialog.component.html'
})
export class AttackStrategyMgmDeleteDialogComponent {

    attackStrategy: AttackStrategyMgm;

    constructor(
        private attackStrategyService: AttackStrategyMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.attackStrategyService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'attackStrategyListModification',
                content: 'Deleted an attackStrategy'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-attack-strategy-mgm-delete-popup',
    template: ''
})
export class AttackStrategyMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private attackStrategyPopupService: AttackStrategyMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.attackStrategyPopupService
                .open(AttackStrategyMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
