import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LikelihoodPositionMgm } from './likelihood-position-mgm.model';
import { LikelihoodPositionMgmPopupService } from './likelihood-position-mgm-popup.service';
import { LikelihoodPositionMgmService } from './likelihood-position-mgm.service';

@Component({
    selector: 'jhi-likelihood-position-mgm-delete-dialog',
    templateUrl: './likelihood-position-mgm-delete-dialog.component.html'
})
export class LikelihoodPositionMgmDeleteDialogComponent {

    likelihoodPosition: LikelihoodPositionMgm;

    constructor(
        private likelihoodPositionService: LikelihoodPositionMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.likelihoodPositionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'likelihoodPositionListModification',
                content: 'Deleted an likelihoodPosition'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-likelihood-position-mgm-delete-popup',
    template: ''
})
export class LikelihoodPositionMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private likelihoodPositionPopupService: LikelihoodPositionMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.likelihoodPositionPopupService
                .open(LikelihoodPositionMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
