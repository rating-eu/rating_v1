import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AnswerMgm } from './answer-mgm.model';
import { AnswerMgmPopupService } from './answer-mgm-popup.service';
import { AnswerMgmService } from './answer-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
    selector: 'jhi-answer-mgm-delete-dialog',
    templateUrl: './answer-mgm-delete-dialog.component.html'
})
export class AnswerMgmDeleteDialogComponent {

    answer: AnswerMgm;

    constructor(
        private answerService: AnswerMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.answerService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'answerListModification',
                content: 'Deleted an answer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-answer-mgm-delete-popup',
    template: ''
})
export class AnswerMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private answerPopupService: AnswerMgmPopupService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        if (isAfterLogIn) {
            this.sessionStorage.store('isAfterLogin', false);
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.answerPopupService
                    .open(AnswerMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
