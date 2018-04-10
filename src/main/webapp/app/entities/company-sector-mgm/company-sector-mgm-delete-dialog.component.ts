import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CompanySectorMgm } from './company-sector-mgm.model';
import { CompanySectorMgmPopupService } from './company-sector-mgm-popup.service';
import { CompanySectorMgmService } from './company-sector-mgm.service';

@Component({
    selector: 'jhi-company-sector-mgm-delete-dialog',
    templateUrl: './company-sector-mgm-delete-dialog.component.html'
})
export class CompanySectorMgmDeleteDialogComponent {

    companySector: CompanySectorMgm;

    constructor(
        private companySectorService: CompanySectorMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.companySectorService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'companySectorListModification',
                content: 'Deleted an companySector'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-company-sector-mgm-delete-popup',
    template: ''
})
export class CompanySectorMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private companySectorPopupService: CompanySectorMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.companySectorPopupService
                .open(CompanySectorMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
