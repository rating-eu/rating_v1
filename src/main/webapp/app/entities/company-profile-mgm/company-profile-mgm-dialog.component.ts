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

import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {CompanyProfileMgm} from './company-profile-mgm.model';
import {CompanyProfileMgmPopupService} from './company-profile-mgm-popup.service';
import {CompanyProfileMgmService} from './company-profile-mgm.service';
import {User, UserService} from '../../shared';
import {ContainerMgm, ContainerMgmService} from '../container-mgm';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';
import {CompanyType} from '../enumerations/CompanyType.enum';

@Component({
    selector: 'jhi-company-profile-mgm-dialog',
    templateUrl: './company-profile-mgm-dialog.component.html'
})
export class CompanyProfileMgmDialogComponent implements OnInit {

    companyProfile: CompanyProfileMgm;
    isSaving: boolean;
    companyTypeEnum = CompanyType;

    users: User[];

    containers: ContainerMgm[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private companyProfileService: CompanyProfileMgmService,
        private userService: UserService,
        private containerService: ContainerMgmService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => {
                this.users = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.containerService.query()
            .subscribe((res: HttpResponse<ContainerMgm[]>) => {
                this.containers = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.companyProfile.id !== undefined) {
            this.subscribeToSaveResponse(
                this.companyProfileService.update(this.companyProfile));
        } else {
            this.subscribeToSaveResponse(
                this.companyProfileService.create(this.companyProfile));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<CompanyProfileMgm>>) {
        result.subscribe((res: HttpResponse<CompanyProfileMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CompanyProfileMgm) {
        this.eventManager.broadcast({name: 'companyProfileListModification', content: 'OK'});
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

    trackContainerById(index: number, item: ContainerMgm) {
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
    selector: 'jhi-company-profile-mgm-popup',
    template: ''
})
export class CompanyProfileMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private companyProfilePopupService: CompanyProfileMgmPopupService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.companyProfilePopupService
                        .open(CompanyProfileMgmDialogComponent as Component, params['id']);
                } else {
                    this.companyProfilePopupService
                        .open(CompanyProfileMgmDialogComponent as Component);
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
