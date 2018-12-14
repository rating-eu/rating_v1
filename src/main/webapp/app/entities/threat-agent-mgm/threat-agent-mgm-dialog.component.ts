import {Component, OnInit, OnDestroy, ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService, JhiDataUtils} from 'ng-jhipster';

import {ThreatAgentMgm} from './threat-agent-mgm.model';
import {ThreatAgentMgmPopupService} from './threat-agent-mgm-popup.service';
import {ThreatAgentMgmService} from './threat-agent-mgm.service';
import {MotivationMgm, MotivationMgmService} from '../motivation-mgm';
import {SessionStorageService} from 'ngx-webstorage';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-threat-agent-mgm-dialog',
    templateUrl: './threat-agent-mgm-dialog.component.html'
})
export class ThreatAgentMgmDialogComponent implements OnInit {

    threatAgent: ThreatAgentMgm;
    isSaving: boolean;

    motivations: MotivationMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private threatAgentService: ThreatAgentMgmService,
        private motivationService: MotivationMgmService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.motivationService.query()
            .subscribe((res: HttpResponse<MotivationMgm[]>) => {
                this.motivations = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.threatAgent, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.threatAgent.id !== undefined) {
            this.subscribeToSaveResponse(
                this.threatAgentService.update(this.threatAgent));
        } else {
            this.subscribeToSaveResponse(
                this.threatAgentService.create(this.threatAgent));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ThreatAgentMgm>>) {
        result.subscribe((res: HttpResponse<ThreatAgentMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ThreatAgentMgm) {
        this.eventManager.broadcast({name: 'threatAgentListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackMotivationById(index: number, item: MotivationMgm) {
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
    selector: 'jhi-threat-agent-mgm-popup',
    template: ''
})
export class ThreatAgentMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private threatAgentPopupService: ThreatAgentMgmPopupService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.threatAgentPopupService
                        .open(ThreatAgentMgmDialogComponent as Component, params['id']);
                } else {
                    this.threatAgentPopupService
                        .open(ThreatAgentMgmDialogComponent as Component);
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
