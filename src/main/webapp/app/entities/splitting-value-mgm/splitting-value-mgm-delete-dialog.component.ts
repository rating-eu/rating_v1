import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SplittingValueMgm } from './splitting-value-mgm.model';
import { SplittingValueMgmPopupService } from './splitting-value-mgm-popup.service';
import { SplittingValueMgmService } from './splitting-value-mgm.service';

@Component({
    selector: 'jhi-splitting-value-mgm-delete-dialog',
    templateUrl: './splitting-value-mgm-delete-dialog.component.html'
})
export class SplittingValueMgmDeleteDialogComponent {

    splittingValue: SplittingValueMgm;

    constructor(
        private splittingValueService: SplittingValueMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.splittingValueService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'splittingValueListModification',
                content: 'Deleted an splittingValue'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-splitting-value-mgm-delete-popup',
    template: ''
})
export class SplittingValueMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private splittingValuePopupService: SplittingValueMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.splittingValuePopupService
                .open(SplittingValueMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
