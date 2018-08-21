import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LikelihoodScaleMgm } from './likelihood-scale-mgm.model';
import { LikelihoodScaleMgmPopupService } from './likelihood-scale-mgm-popup.service';
import { LikelihoodScaleMgmService } from './likelihood-scale-mgm.service';

@Component({
    selector: 'jhi-likelihood-scale-mgm-delete-dialog',
    templateUrl: './likelihood-scale-mgm-delete-dialog.component.html'
})
export class LikelihoodScaleMgmDeleteDialogComponent {

    likelihoodScale: LikelihoodScaleMgm;

    constructor(
        private likelihoodScaleService: LikelihoodScaleMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.likelihoodScaleService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'likelihoodScaleListModification',
                content: 'Deleted an likelihoodScale'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-likelihood-scale-mgm-delete-popup',
    template: ''
})
export class LikelihoodScaleMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private likelihoodScalePopupService: LikelihoodScaleMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.likelihoodScalePopupService
                .open(LikelihoodScaleMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
