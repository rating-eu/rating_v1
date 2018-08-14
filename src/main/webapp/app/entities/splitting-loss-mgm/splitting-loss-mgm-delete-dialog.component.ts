import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SplittingLossMgm } from './splitting-loss-mgm.model';
import { SplittingLossMgmPopupService } from './splitting-loss-mgm-popup.service';
import { SplittingLossMgmService } from './splitting-loss-mgm.service';

@Component({
    selector: 'jhi-splitting-loss-mgm-delete-dialog',
    templateUrl: './splitting-loss-mgm-delete-dialog.component.html'
})
export class SplittingLossMgmDeleteDialogComponent {

    splittingLoss: SplittingLossMgm;

    constructor(
        private splittingLossService: SplittingLossMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.splittingLossService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'splittingLossListModification',
                content: 'Deleted an splittingLoss'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-splitting-loss-mgm-delete-popup',
    template: ''
})
export class SplittingLossMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private splittingLossPopupService: SplittingLossMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.splittingLossPopupService
                .open(SplittingLossMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
