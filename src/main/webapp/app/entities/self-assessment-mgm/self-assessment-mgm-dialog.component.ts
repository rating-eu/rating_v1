import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SelfAssessmentMgm } from './self-assessment-mgm.model';
import { SelfAssessmentMgmPopupService } from './self-assessment-mgm-popup.service';
import { SelfAssessmentMgmService } from './self-assessment-mgm.service';
import { User, UserService } from '../../shared';
import { CompanyProfileMgm, CompanyProfileMgmService } from '../company-profile-mgm';
import { CompanyGroupMgm, CompanyGroupMgmService } from '../company-group-mgm';
import { AssetMgm, AssetMgmService } from '../asset-mgm';
import { ThreatAgentMgm, ThreatAgentMgmService } from '../threat-agent-mgm';
import { AttackStrategyMgm, AttackStrategyMgmService } from '../attack-strategy-mgm';
import { ExternalAuditMgm, ExternalAuditMgmService } from '../external-audit-mgm';
import { QuestionnaireMgm, QuestionnaireMgmService } from '../questionnaire-mgm';

@Component({
    selector: 'jhi-self-assessment-mgm-dialog',
    templateUrl: './self-assessment-mgm-dialog.component.html'
})
export class SelfAssessmentMgmDialogComponent implements OnInit {

    selfAssessment: SelfAssessmentMgm;
    isSaving: boolean;

    users: User[];

    companyprofiles: CompanyProfileMgm[];

    companygroups: CompanyGroupMgm[];

    assets: AssetMgm[];

    threatagents: ThreatAgentMgm[];

    attackstrategies: AttackStrategyMgm[];

    externalaudits: ExternalAuditMgm[];

    questionnaires: QuestionnaireMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private userService: UserService,
        private companyProfileService: CompanyProfileMgmService,
        private companyGroupService: CompanyGroupMgmService,
        private assetService: AssetMgmService,
        private threatAgentService: ThreatAgentMgmService,
        private attackStrategyService: AttackStrategyMgmService,
        private externalAuditService: ExternalAuditMgmService,
        private questionnaireService: QuestionnaireMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.companyProfileService.query()
            .subscribe((res: HttpResponse<CompanyProfileMgm[]>) => { this.companyprofiles = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.companyGroupService.query()
            .subscribe((res: HttpResponse<CompanyGroupMgm[]>) => { this.companygroups = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.assetService.query()
            .subscribe((res: HttpResponse<AssetMgm[]>) => { this.assets = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.threatAgentService.query()
            .subscribe((res: HttpResponse<ThreatAgentMgm[]>) => { this.threatagents = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.attackStrategyService.query()
            .subscribe((res: HttpResponse<AttackStrategyMgm[]>) => { this.attackstrategies = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.externalAuditService.query()
            .subscribe((res: HttpResponse<ExternalAuditMgm[]>) => { this.externalaudits = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireService.query()
            .subscribe((res: HttpResponse<QuestionnaireMgm[]>) => { this.questionnaires = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.selfAssessment.id !== undefined) {
            this.subscribeToSaveResponse(
                this.selfAssessmentService.update(this.selfAssessment));
        } else {
            this.subscribeToSaveResponse(
                this.selfAssessmentService.create(this.selfAssessment));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SelfAssessmentMgm>>) {
        result.subscribe((res: HttpResponse<SelfAssessmentMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SelfAssessmentMgm) {
        this.eventManager.broadcast({ name: 'selfAssessmentListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }

    trackCompanyProfileById(index: number, item: CompanyProfileMgm) {
        return item.id;
    }

    trackCompanyGroupById(index: number, item: CompanyGroupMgm) {
        return item.id;
    }

    trackAssetById(index: number, item: AssetMgm) {
        return item.id;
    }

    trackThreatAgentById(index: number, item: ThreatAgentMgm) {
        return item.id;
    }

    trackAttackStrategyById(index: number, item: AttackStrategyMgm) {
        return item.id;
    }

    trackExternalAuditById(index: number, item: ExternalAuditMgm) {
        return item.id;
    }

    trackQuestionnaireById(index: number, item: QuestionnaireMgm) {
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
    selector: 'jhi-self-assessment-mgm-popup',
    template: ''
})
export class SelfAssessmentMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private selfAssessmentPopupService: SelfAssessmentMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.selfAssessmentPopupService
                    .open(SelfAssessmentMgmDialogComponent as Component, params['id']);
            } else {
                this.selfAssessmentPopupService
                    .open(SelfAssessmentMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
