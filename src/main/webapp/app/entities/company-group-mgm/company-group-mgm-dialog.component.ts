import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {CompanyGroupMgm} from './company-group-mgm.model';
import {CompanyGroupMgmPopupService} from './company-group-mgm-popup.service';
import {CompanyGroupMgmService} from './company-group-mgm.service';
import {User, UserService} from '../../shared';
import {CompanyProfileMgm, CompanyProfileMgmService} from '../company-profile-mgm';
import {SessionStorageService} from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-company-group-mgm-dialog',
    templateUrl: './company-group-mgm-dialog.component.html'
})
export class CompanyGroupMgmDialogComponent implements OnInit {

    companyGroup: CompanyGroupMgm;
    isSaving: boolean;

    users: User[];

    companyprofiles: CompanyProfileMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private companyGroupService: CompanyGroupMgmService,
        private userService: UserService,
        private companyProfileService: CompanyProfileMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => {
                this.users = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.companyProfileService.query()
            .subscribe((res: HttpResponse<CompanyProfileMgm[]>) => {
                this.companyprofiles = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.companyGroup.id !== undefined) {
            this.subscribeToSaveResponse(
                this.companyGroupService.update(this.companyGroup));
        } else {
            this.subscribeToSaveResponse(
                this.companyGroupService.create(this.companyGroup));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<CompanyGroupMgm>>) {
        result.subscribe((res: HttpResponse<CompanyGroupMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CompanyGroupMgm) {
        this.eventManager.broadcast({name: 'companyGroupListModification', content: 'OK'});
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
}

@Component({
    selector: 'jhi-company-group-mgm-popup',
    template: ''
})
export class CompanyGroupMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private companyGroupPopupService: CompanyGroupMgmPopupService,
        private sessionStorage: SessionStorageService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.companyGroupPopupService
                        .open(CompanyGroupMgmDialogComponent as Component, params['id']);
                } else {
                    this.companyGroupPopupService
                        .open(CompanyGroupMgmDialogComponent as Component);
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
