import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { TranslationMgm } from './translation-mgm.model';
import { TranslationMgmPopupService } from './translation-mgm-popup.service';
import { TranslationMgmService } from './translation-mgm.service';

@Component({
    selector: 'jhi-translation-mgm-delete-dialog',
    templateUrl: './translation-mgm-delete-dialog.component.html'
})
export class TranslationMgmDeleteDialogComponent {

    translation: TranslationMgm;

    constructor(
        private translationService: TranslationMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.translationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'translationListModification',
                content: 'Deleted an translation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-translation-mgm-delete-popup',
    template: ''
})
export class TranslationMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private translationPopupService: TranslationMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.translationPopupService
                .open(TranslationMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
