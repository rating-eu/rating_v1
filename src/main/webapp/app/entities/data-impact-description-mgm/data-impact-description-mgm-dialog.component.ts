import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DataImpactDescriptionMgm } from './data-impact-description-mgm.model';
import { DataImpactDescriptionMgmPopupService } from './data-impact-description-mgm-popup.service';
import { DataImpactDescriptionMgmService } from './data-impact-description-mgm.service';

@Component({
    selector: 'jhi-data-impact-description-mgm-dialog',
    templateUrl: './data-impact-description-mgm-dialog.component.html'
})
export class DataImpactDescriptionMgmDialogComponent implements OnInit {

    dataImpactDescription: DataImpactDescriptionMgm;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataImpactDescriptionService: DataImpactDescriptionMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.dataImpactDescription.id !== undefined) {
            this.subscribeToSaveResponse(
                this.dataImpactDescriptionService.update(this.dataImpactDescription));
        } else {
            this.subscribeToSaveResponse(
                this.dataImpactDescriptionService.create(this.dataImpactDescription));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<DataImpactDescriptionMgm>>) {
        result.subscribe((res: HttpResponse<DataImpactDescriptionMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: DataImpactDescriptionMgm) {
        this.eventManager.broadcast({ name: 'dataImpactDescriptionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-data-impact-description-mgm-popup',
    template: ''
})
export class DataImpactDescriptionMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private dataImpactDescriptionPopupService: DataImpactDescriptionMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.dataImpactDescriptionPopupService
                    .open(DataImpactDescriptionMgmDialogComponent as Component, params['id']);
            } else {
                this.dataImpactDescriptionPopupService
                    .open(DataImpactDescriptionMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
