import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LogoMgm } from './logo-mgm.model';
import { LogoMgmPopupService } from './logo-mgm-popup.service';
import { LogoMgmService } from './logo-mgm.service';

@Component({
    selector: 'jhi-logo-mgm-delete-dialog',
    templateUrl: './logo-mgm-delete-dialog.component.html'
})
export class LogoMgmDeleteDialogComponent {

    logo: LogoMgm;

    constructor(
        private logoService: LogoMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.logoService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'logoListModification',
                content: 'Deleted an logo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-logo-mgm-delete-popup',
    template: ''
})
export class LogoMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private logoPopupService: LogoMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.logoPopupService
                .open(LogoMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
