import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionMgm } from './question-mgm.model';
import { QuestionMgmPopupService } from './question-mgm-popup.service';
import { QuestionMgmService } from './question-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-question-mgm-delete-dialog',
    templateUrl: './question-mgm-delete-dialog.component.html'
})
export class QuestionMgmDeleteDialogComponent {

    question: QuestionMgm;

    constructor(
        private questionService: QuestionMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionListModification',
                content: 'Deleted an question'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-question-mgm-delete-popup',
    template: ''
})
export class QuestionMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionPopupService: QuestionMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.questionPopupService
                    .open(QuestionMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
