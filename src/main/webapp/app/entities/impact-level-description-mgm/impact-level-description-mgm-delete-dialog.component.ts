import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ImpactLevelDescriptionMgm } from './impact-level-description-mgm.model';
import { ImpactLevelDescriptionMgmPopupService } from './impact-level-description-mgm-popup.service';
import { ImpactLevelDescriptionMgmService } from './impact-level-description-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-impact-level-description-mgm-delete-dialog',
    templateUrl: './impact-level-description-mgm-delete-dialog.component.html'
})
export class ImpactLevelDescriptionMgmDeleteDialogComponent {

    impactLevelDescription: ImpactLevelDescriptionMgm;

    constructor(
        private impactLevelDescriptionService: ImpactLevelDescriptionMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.impactLevelDescriptionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'impactLevelDescriptionListModification',
                content: 'Deleted an impactLevelDescription'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-impact-level-description-mgm-delete-popup',
    template: ''
})
export class ImpactLevelDescriptionMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private impactLevelDescriptionPopupService: ImpactLevelDescriptionMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.impactLevelDescriptionPopupService
                    .open(ImpactLevelDescriptionMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
