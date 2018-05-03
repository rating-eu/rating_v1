import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AttackStrategyMgm } from './attack-strategy-mgm.model';
import { AttackStrategyMgmPopupService } from './attack-strategy-mgm-popup.service';
import { AttackStrategyMgmService } from './attack-strategy-mgm.service';
import { MitigationMgm, MitigationMgmService } from '../mitigation-mgm';
import { AnswerMgm, AnswerMgmService } from '../answer-mgm';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';

@Component({
    selector: 'jhi-attack-strategy-mgm-dialog',
    templateUrl: './attack-strategy-mgm-dialog.component.html'
})
export class AttackStrategyMgmDialogComponent implements OnInit {

    attackStrategy: AttackStrategyMgm;
    isSaving: boolean;

    mitigations: MitigationMgm[];

    answers: AnswerMgm[];

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private attackStrategyService: AttackStrategyMgmService,
        private mitigationService: MitigationMgmService,
        private answerService: AnswerMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.mitigationService.query()
            .subscribe((res: HttpResponse<MitigationMgm[]>) => { this.mitigations = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.answerService.query()
            .subscribe((res: HttpResponse<AnswerMgm[]>) => { this.answers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.selfAssessmentService.query()
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => { this.selfassessments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.attackStrategy.id !== undefined) {
            this.subscribeToSaveResponse(
                this.attackStrategyService.update(this.attackStrategy));
        } else {
            this.subscribeToSaveResponse(
                this.attackStrategyService.create(this.attackStrategy));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<AttackStrategyMgm>>) {
        result.subscribe((res: HttpResponse<AttackStrategyMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: AttackStrategyMgm) {
        this.eventManager.broadcast({ name: 'attackStrategyListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackMitigationById(index: number, item: MitigationMgm) {
        return item.id;
    }

    trackAnswerById(index: number, item: AnswerMgm) {
        return item.id;
    }

    trackSelfAssessmentById(index: number, item: SelfAssessmentMgm) {
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
    selector: 'jhi-attack-strategy-mgm-popup',
    template: ''
})
export class AttackStrategyMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private attackStrategyPopupService: AttackStrategyMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.attackStrategyPopupService
                    .open(AttackStrategyMgmDialogComponent as Component, params['id']);
            } else {
                this.attackStrategyPopupService
                    .open(AttackStrategyMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
