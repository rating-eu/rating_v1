import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AnswerWeightMgm } from './answer-weight-mgm.model';
import { AnswerWeightMgmPopupService } from './answer-weight-mgm-popup.service';
import { AnswerWeightMgmService } from './answer-weight-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-answer-weight-mgm-delete-dialog',
    templateUrl: './answer-weight-mgm-delete-dialog.component.html'
})
export class AnswerWeightMgmDeleteDialogComponent {

    answerWeight: AnswerWeightMgm;

    constructor(
        private answerWeightService: AnswerWeightMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.answerWeightService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'answerWeightListModification',
                content: 'Deleted an answerWeight'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-answer-weight-mgm-delete-popup',
    template: ''
})
export class AnswerWeightMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private answerWeightPopupService: AnswerWeightMgmPopupService,
        private popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.answerWeightPopupService
                    .open(AnswerWeightMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
