import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionRelevanceMgm } from './question-relevance-mgm.model';
import { QuestionRelevanceMgmPopupService } from './question-relevance-mgm-popup.service';
import { QuestionRelevanceMgmService } from './question-relevance-mgm.service';

@Component({
    selector: 'jhi-question-relevance-mgm-delete-dialog',
    templateUrl: './question-relevance-mgm-delete-dialog.component.html'
})
export class QuestionRelevanceMgmDeleteDialogComponent {

    questionRelevance: QuestionRelevanceMgm;

    constructor(
        private questionRelevanceService: QuestionRelevanceMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionRelevanceService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionRelevanceListModification',
                content: 'Deleted an questionRelevance'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-question-relevance-mgm-delete-popup',
    template: ''
})
export class QuestionRelevanceMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionRelevancePopupService: QuestionRelevanceMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.questionRelevancePopupService
                .open(QuestionRelevanceMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
