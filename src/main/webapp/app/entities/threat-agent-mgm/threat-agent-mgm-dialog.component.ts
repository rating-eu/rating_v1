import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ThreatAgentMgm } from './threat-agent-mgm.model';
import { ThreatAgentMgmPopupService } from './threat-agent-mgm-popup.service';
import { ThreatAgentMgmService } from './threat-agent-mgm.service';
import { MotivationMgm, MotivationMgmService } from '../motivation-mgm';
import { AnswerMgm, AnswerMgmService } from '../answer-mgm';
import { AttackStrategyMgm, AttackStrategyMgmService } from '../attack-strategy-mgm';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';

@Component({
    selector: 'jhi-threat-agent-mgm-dialog',
    templateUrl: './threat-agent-mgm-dialog.component.html'
})
export class ThreatAgentMgmDialogComponent implements OnInit {

    threatAgent: ThreatAgentMgm;
    isSaving: boolean;

    motivations: MotivationMgm[];

    answers: AnswerMgm[];

    attackstrategies: AttackStrategyMgm[];

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private threatAgentService: ThreatAgentMgmService,
        private motivationService: MotivationMgmService,
        private answerService: AnswerMgmService,
        private attackStrategyService: AttackStrategyMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.motivationService.query()
            .subscribe((res: HttpResponse<MotivationMgm[]>) => { this.motivations = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.answerService.query()
            .subscribe((res: HttpResponse<AnswerMgm[]>) => { this.answers = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.attackStrategyService.query()
            .subscribe((res: HttpResponse<AttackStrategyMgm[]>) => { this.attackstrategies = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.selfAssessmentService.query()
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => { this.selfassessments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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
        this.eventManager.broadcast({ name: 'threatAgentListModification', content: 'OK'});
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

    trackAnswerById(index: number, item: AnswerMgm) {
        return item.id;
    }

    trackAttackStrategyById(index: number, item: AttackStrategyMgm) {
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
    selector: 'jhi-threat-agent-mgm-popup',
    template: ''
})
export class ThreatAgentMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private threatAgentPopupService: ThreatAgentMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.threatAgentPopupService
                    .open(ThreatAgentMgmDialogComponent as Component, params['id']);
            } else {
                this.threatAgentPopupService
                    .open(ThreatAgentMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
