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

import {QuestionnaireStatusMgm} from './questionnaire-status-mgm.model';
import {QuestionnaireStatusMgmPopupService} from './questionnaire-status-mgm-popup.service';
import {QuestionnaireStatusMgmService} from './questionnaire-status-mgm.service';
import {QuestionnaireMgm, QuestionnaireMgmService} from '../questionnaire-mgm';
import {User, UserService} from '../../shared';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';
import {CompanyProfileMgm, CompanyProfileMgmService} from "../company-profile-mgm";

@Component({
    selector: 'jhi-questionnaire-status-mgm-dialog',
    templateUrl: './questionnaire-status-mgm-dialog.component.html'
})
export class QuestionnaireStatusMgmDialogComponent implements OnInit {

    questionnaireStatus: QuestionnaireStatusMgm;
    isSaving: boolean;

    companyProfiles: CompanyProfileMgm[];

    questionnaires: QuestionnaireMgm[];

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        private companyProfileService: CompanyProfileMgmService,
        private questionnaireService: QuestionnaireMgmService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.companyProfileService
            .query({filter: 'questionnairestatus-is-null'})
            .subscribe((res: HttpResponse<CompanyProfileMgm[]>) => {
                if (!this.questionnaireStatus.companyProfile || !this.questionnaireStatus.companyProfile.id) {
                    this.companyProfiles = res.body;
                } else {
                    this.companyProfileService
                        .find(this.questionnaireStatus.companyProfile.id)
                        .subscribe((subRes: HttpResponse<CompanyProfileMgm>) => {
                            this.companyProfiles = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireService
            .query({filter: 'questionnairestatus-is-null'})
            .subscribe((res: HttpResponse<QuestionnaireMgm[]>) => {
                if (!this.questionnaireStatus.questionnaire || !this.questionnaireStatus.questionnaire.id) {
                    this.questionnaires = res.body;
                } else {
                    this.questionnaireService
                        .find(this.questionnaireStatus.questionnaire.id)
                        .subscribe((subRes: HttpResponse<QuestionnaireMgm>) => {
                            this.questionnaires = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => {
                this.users = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.questionnaireStatus.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionnaireStatusService.update(this.questionnaireStatus));
        } else {
            this.subscribeToSaveResponse(
                this.questionnaireStatusService.create(this.questionnaireStatus));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionnaireStatusMgm>>) {
        result.subscribe((res: HttpResponse<QuestionnaireStatusMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionnaireStatusMgm) {
        this.eventManager.broadcast({name: 'questionnaireStatusListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackCompanyProfileById(index: number, item: CompanyProfileMgm) {
        return item.id;
    }

    trackQuestionnaireById(index: number, item: QuestionnaireMgm) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-questionnaire-status-mgm-popup',
    template: ''
})
export class QuestionnaireStatusMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionnaireStatusPopupService: QuestionnaireStatusMgmPopupService,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.questionnaireStatusPopupService
                        .open(QuestionnaireStatusMgmDialogComponent as Component, params['id']);
                } else {
                    this.questionnaireStatusPopupService
                        .open(QuestionnaireStatusMgmDialogComponent as Component);
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
