import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionnaireMgm } from './questionnaire-mgm.model';
import { QuestionnaireMgmPopupService } from './questionnaire-mgm-popup.service';
import { QuestionnaireMgmService } from './questionnaire-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-questionnaire-mgm-delete-dialog',
    templateUrl: './questionnaire-mgm-delete-dialog.component.html'
})
export class QuestionnaireMgmDeleteDialogComponent {

    questionnaire: QuestionnaireMgm;

    constructor(
        private questionnaireService: QuestionnaireMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionnaireService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionnaireListModification',
                content: 'Deleted an questionnaire'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-questionnaire-mgm-delete-popup',
    template: ''
})
export class QuestionnaireMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionnairePopupService: QuestionnaireMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.questionnairePopupService
                    .open(QuestionnaireMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
