/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MyCompanyMgm } from './my-company-mgm.model';
import { MyCompanyMgmPopupService } from './my-company-mgm-popup.service';
import { MyCompanyMgmService } from './my-company-mgm.service';
import { User, UserService } from '../../shared';
import { CompanyProfileMgm, CompanyProfileMgmService } from '../company-profile-mgm';
import { SessionStorageService } from 'ngx-webstorage';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-my-company-mgm-dialog',
    templateUrl: './my-company-mgm-dialog.component.html'
})
export class MyCompanyMgmDialogComponent implements OnInit {

    myCompany: MyCompanyMgm;
    isSaving: boolean;

    users: User[];

    companyprofiles: CompanyProfileMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private myCompanyService: MyCompanyMgmService,
        private userService: UserService,
        private companyProfileService: CompanyProfileMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.companyProfileService.query()
            .subscribe((res: HttpResponse<CompanyProfileMgm[]>) => { this.companyprofiles = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.myCompany.id !== undefined) {
            this.subscribeToSaveResponse(
                this.myCompanyService.update(this.myCompany));
        } else {
            this.subscribeToSaveResponse(
                this.myCompanyService.create(this.myCompany));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MyCompanyMgm>>) {
        result.subscribe((res: HttpResponse<MyCompanyMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MyCompanyMgm) {
        this.eventManager.broadcast({ name: 'myCompanyListModification', content: 'OK' });
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
    selector: 'jhi-my-company-mgm-popup',
    template: ''
})
export class MyCompanyMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myCompanyPopupService: MyCompanyMgmPopupService,
        public popUpService: PopUpService
    ) { }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.myCompanyPopupService
                        .open(MyCompanyMgmDialogComponent as Component, params['id']);
                } else {
                    this.myCompanyPopupService
                        .open(MyCompanyMgmDialogComponent as Component);
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
