import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CompanySectorMgm } from './company-sector-mgm.model';
import { CompanySectorMgmPopupService } from './company-sector-mgm-popup.service';
import { CompanySectorMgmService } from './company-sector-mgm.service';
import { User, UserService } from '../../shared';
import { CompanyProfileMgm, CompanyProfileMgmService } from '../company-profile-mgm';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';

@Component({
    selector: 'jhi-company-sector-mgm-dialog',
    templateUrl: './company-sector-mgm-dialog.component.html'
})
export class CompanySectorMgmDialogComponent implements OnInit {

    companySector: CompanySectorMgm;
    isSaving: boolean;

    users: User[];

    companyprofiles: CompanyProfileMgm[];

    selfassessments: SelfAssessmentMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private companySectorService: CompanySectorMgmService,
        private userService: UserService,
        private companyProfileService: CompanyProfileMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.companyProfileService.query()
            .subscribe((res: HttpResponse<CompanyProfileMgm[]>) => { this.companyprofiles = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.selfAssessmentService.query()
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => { this.selfassessments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.companySector.id !== undefined) {
            this.subscribeToSaveResponse(
                this.companySectorService.update(this.companySector));
        } else {
            this.subscribeToSaveResponse(
                this.companySectorService.create(this.companySector));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<CompanySectorMgm>>) {
        result.subscribe((res: HttpResponse<CompanySectorMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CompanySectorMgm) {
        this.eventManager.broadcast({ name: 'companySectorListModification', content: 'OK'});
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
    selector: 'jhi-company-sector-mgm-popup',
    template: ''
})
export class CompanySectorMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private companySectorPopupService: CompanySectorMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.companySectorPopupService
                    .open(CompanySectorMgmDialogComponent as Component, params['id']);
            } else {
                this.companySectorPopupService
                    .open(CompanySectorMgmDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
