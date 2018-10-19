import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SelfAssessmentMgm } from './self-assessment-mgm.model';
import { SelfAssessmentMgmPopupService } from './self-assessment-mgm-popup.service';
import { SelfAssessmentMgmService } from './self-assessment-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-self-assessment-mgm-delete-dialog',
    templateUrl: './self-assessment-mgm-delete-dialog.component.html'
})
export class SelfAssessmentMgmDeleteDialogComponent {

    selfAssessment: SelfAssessmentMgm;

    constructor(
        private selfAssessmentService: SelfAssessmentMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private router: Router
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.selfAssessmentService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'selfAssessmentListModification',
                content: 'Deleted an selfAssessment'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-self-assessment-mgm-delete-popup',
    template: ''
})
export class SelfAssessmentMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private selfAssessmentPopupService: SelfAssessmentMgmPopupService,
        private sessionStorage: SessionStorageService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.selfAssessmentPopupService
                    .open(SelfAssessmentMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
