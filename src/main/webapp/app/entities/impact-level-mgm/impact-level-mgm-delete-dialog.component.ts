import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ImpactLevelMgm } from './impact-level-mgm.model';
import { ImpactLevelMgmPopupService } from './impact-level-mgm-popup.service';
import { ImpactLevelMgmService } from './impact-level-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-impact-level-mgm-delete-dialog',
    templateUrl: './impact-level-mgm-delete-dialog.component.html'
})
export class ImpactLevelMgmDeleteDialogComponent {

    impactLevel: ImpactLevelMgm;

    constructor(
        private impactLevelService: ImpactLevelMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.impactLevelService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'impactLevelListModification',
                content: 'Deleted an impactLevel'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-impact-level-mgm-delete-popup',
    template: ''
})
export class ImpactLevelMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private impactLevelPopupService: ImpactLevelMgmPopupService,
        private popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.impactLevelPopupService
                    .open(ImpactLevelMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
