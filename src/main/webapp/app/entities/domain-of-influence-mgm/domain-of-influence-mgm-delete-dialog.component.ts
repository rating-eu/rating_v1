import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DomainOfInfluenceMgm } from './domain-of-influence-mgm.model';
import { DomainOfInfluenceMgmPopupService } from './domain-of-influence-mgm-popup.service';
import { DomainOfInfluenceMgmService } from './domain-of-influence-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-domain-of-influence-mgm-delete-dialog',
    templateUrl: './domain-of-influence-mgm-delete-dialog.component.html'
})
export class DomainOfInfluenceMgmDeleteDialogComponent {

    domainOfInfluence: DomainOfInfluenceMgm;

    constructor(
        private domainOfInfluenceService: DomainOfInfluenceMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.domainOfInfluenceService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'domainOfInfluenceListModification',
                content: 'Deleted an domainOfInfluence'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-domain-of-influence-mgm-delete-popup',
    template: ''
})
export class DomainOfInfluenceMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private domainOfInfluencePopupService: DomainOfInfluenceMgmPopupService,
        private popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.domainOfInfluencePopupService
                    .open(DomainOfInfluenceMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
