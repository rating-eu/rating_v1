import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PopUpService} from '../../../../shared/pop-up-services/pop-up.service';
import {PartialSubmitPopupService} from './partial-submit-popup.service';

@Component({
    selector: 'jhi-partial-submit-dialog',
    templateUrl: './partial-submit-dialog.component.html'
})
export class PartialSubmitDialogComponent {

    constructor(
        public activeModal: NgbActiveModal,
    ) {
    }

    clear() {
        this.activeModal.close(false);
    }

    confirm() {
        this.activeModal.close(true);
    }

    cancel() {
        this.activeModal.close(false);
    }
}

@Component({
    selector: 'jhi-partial-submit-popup',
    template: ''
})
export class PartialSubmitPopupComponent implements OnInit, OnDestroy {

    constructor(
        private partialSubmitPopupService: PartialSubmitPopupService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.partialSubmitPopupService
                .open(PartialSubmitDialogComponent as Component);
        }
    }

    ngOnDestroy() {
    }
}
