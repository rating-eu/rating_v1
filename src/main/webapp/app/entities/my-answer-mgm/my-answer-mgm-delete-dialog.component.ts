import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { MyAnswerMgm } from './my-answer-mgm.model';
import { MyAnswerMgmPopupService } from './my-answer-mgm-popup.service';
import { MyAnswerMgmService } from './my-answer-mgm.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-my-answer-mgm-delete-dialog',
    templateUrl: './my-answer-mgm-delete-dialog.component.html'
})
export class MyAnswerMgmDeleteDialogComponent {

    myAnswer: MyAnswerMgm;

    constructor(
        private myAnswerService: MyAnswerMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.myAnswerService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'myAnswerListModification',
                content: 'Deleted an myAnswer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-my-answer-mgm-delete-popup',
    template: ''
})
export class MyAnswerMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myAnswerPopupService: MyAnswerMgmPopupService,
        private popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.myAnswerPopupService
                    .open(MyAnswerMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
