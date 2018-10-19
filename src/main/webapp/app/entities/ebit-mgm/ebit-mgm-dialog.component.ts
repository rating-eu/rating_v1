import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {EBITMgm} from './ebit-mgm.model';
import {EBITMgmPopupService} from './ebit-mgm-popup.service';
import {EBITMgmService} from './ebit-mgm.service';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../self-assessment-mgm';
import {SessionStorageService} from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-ebit-mgm-dialog',
    templateUrl: './ebit-mgm-dialog.component.html'
})
export class EBITMgmDialogComponent implements OnInit {

    eBIT: EBITMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eBITService: EBITMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.selfAssessmentService
            .query({filter: 'ebit-is-null'})
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => {
                if (!this.eBIT.selfAssessment || !this.eBIT.selfAssessment.id) {
                    this.selfassessments = res.body;
                } else {
                    this.selfAssessmentService
                        .find(this.eBIT.selfAssessment.id)
                        .subscribe((subRes: HttpResponse<SelfAssessmentMgm>) => {
                            this.selfassessments = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.eBIT.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eBITService.update(this.eBIT));
        } else {
            this.subscribeToSaveResponse(
                this.eBITService.create(this.eBIT));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<EBITMgm>>) {
        result.subscribe((res: HttpResponse<EBITMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: EBITMgm) {
        this.eventManager.broadcast({name: 'eBITListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackSelfAssessmentById(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-ebit-mgm-popup',
    template: ''
})
export class EBITMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eBITPopupService: EBITMgmPopupService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.eBITPopupService
                        .open(EBITMgmDialogComponent as Component, params['id']);
                } else {
                    this.eBITPopupService
                        .open(EBITMgmDialogComponent as Component);
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
