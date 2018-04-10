import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MotivationMgm } from './motivation-mgm.model';
import { MotivationMgmPopupService } from './motivation-mgm-popup.service';
import { MotivationMgmService } from './motivation-mgm.service';
import { ThreatAgentMgm, ThreatAgentMgmService } from '../threat-agent-mgm';

@Component({
    selector: 'jhi-motivation-mgm-dialog',
    templateUrl: './motivation-mgm-dialog.component.html'
})
export class MotivationMgmDialogComponent implements OnInit {

    motivation: MotivationMgm;
    isSaving: boolean;

    threatagents: ThreatAgentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private motivationService: MotivationMgmService,
        private threatAgentService: ThreatAgentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.threatAgentService.query()
            .subscribe((res: HttpResponse<ThreatAgentMgm[]>) => { this.threatagents = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.motivation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.motivationService.update(this.motivation));
        } else {
            this.subscribeToSaveResponse(
                this.motivationService.create(this.motivation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MotivationMgm>>) {
        result.subscribe((res: HttpResponse<MotivationMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MotivationMgm) {
        this.eventManager.broadcast({ name: 'motivationListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackThreatAgentById(index: number, item: ThreatAgentMgm) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-motivation-mgm-popup',
    template: ''
})
export class MotivationMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private motivationPopupService: MotivationMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.motivationPopupService
                    .open(MotivationMgmDialogComponent as Component, params['id']);
            } else {
                this.motivationPopupService
                    .open(MotivationMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
