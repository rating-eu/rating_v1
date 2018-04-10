import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ContainerMgm } from './container-mgm.model';
import { ContainerMgmPopupService } from './container-mgm-popup.service';
import { ContainerMgmService } from './container-mgm.service';

@Component({
    selector: 'jhi-container-mgm-delete-dialog',
    templateUrl: './container-mgm-delete-dialog.component.html'
})
export class ContainerMgmDeleteDialogComponent {

    container: ContainerMgm;

    constructor(
        private containerService: ContainerMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.containerService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'containerListModification',
                content: 'Deleted an container'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-container-mgm-delete-popup',
    template: ''
})
export class ContainerMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private containerPopupService: ContainerMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.containerPopupService
                .open(ContainerMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
