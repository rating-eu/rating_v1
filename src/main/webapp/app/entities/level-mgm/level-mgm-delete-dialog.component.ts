import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LevelMgm } from './level-mgm.model';
import { LevelMgmPopupService } from './level-mgm-popup.service';
import { LevelMgmService } from './level-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-level-mgm-delete-dialog',
    templateUrl: './level-mgm-delete-dialog.component.html'
})
export class LevelMgmDeleteDialogComponent {

    level: LevelMgm;

    constructor(
        private levelService: LevelMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.levelService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'levelListModification',
                content: 'Deleted an level'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-level-mgm-delete-popup',
    template: ''
})
export class LevelMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private levelPopupService: LevelMgmPopupService,
        private popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.levelPopupService
                    .open(LevelMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
