import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LevelWrapperMgm } from './level-wrapper-mgm.model';
import { LevelWrapperMgmPopupService } from './level-wrapper-mgm-popup.service';
import { LevelWrapperMgmService } from './level-wrapper-mgm.service';

@Component({
    selector: 'jhi-level-wrapper-mgm-delete-dialog',
    templateUrl: './level-wrapper-mgm-delete-dialog.component.html'
})
export class LevelWrapperMgmDeleteDialogComponent {

    levelWrapper: LevelWrapperMgm;

    constructor(
        private levelWrapperService: LevelWrapperMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.levelWrapperService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'levelWrapperListModification',
                content: 'Deleted an levelWrapper'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-level-wrapper-mgm-delete-popup',
    template: ''
})
export class LevelWrapperMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private levelWrapperPopupService: LevelWrapperMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.levelWrapperPopupService
                .open(LevelWrapperMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
