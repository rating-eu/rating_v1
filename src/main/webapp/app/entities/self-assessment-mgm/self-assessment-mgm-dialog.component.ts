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

import {SelfAssessmentMgm} from './self-assessment-mgm.model';
import {SelfAssessmentMgmPopupService} from './self-assessment-mgm-popup.service';
import {SelfAssessmentMgmService} from './self-assessment-mgm.service';
import {CompanyProfileMgm, CompanyProfileMgmService} from '../company-profile-mgm';
import {AccountService, User, UserService} from '../../shared';
import {CompanyGroupMgm, CompanyGroupMgmService} from '../company-group-mgm';
import {AssetMgm, AssetMgmService} from '../asset-mgm';
import {ThreatAgentMgm, ThreatAgentMgmService} from '../threat-agent-mgm';
import {AttackStrategyMgm, AttackStrategyMgmService} from '../attack-strategy-mgm';
import {ExternalAuditMgm, ExternalAuditMgmService} from '../external-audit-mgm';
import {QuestionnaireMgm, QuestionnaireMgmService} from '../questionnaire-mgm';
import {MyCompanyMgm, MyCompanyMgmService} from '../my-company-mgm';
import {SessionStorageService} from 'ngx-webstorage';
import {PopupService} from '@ng-bootstrap/ng-bootstrap/util/popup';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';
import {DatasharingService} from '../../datasharing/datasharing.service';

@Component({
    selector: 'jhi-self-assessment-mgm-dialog',
    templateUrl: './self-assessment-mgm-dialog.component.html'
})
export class SelfAssessmentMgmDialogComponent implements OnInit {

    selfAssessment: SelfAssessmentMgm;
    isSaving: boolean;

    companyprofiles: CompanyProfileMgm[];

    users: User[];

    companygroups: CompanyGroupMgm[];

    assets: AssetMgm[];

    threatagents: ThreatAgentMgm[];

    attackstrategies: AttackStrategyMgm[];

    externalaudits: ExternalAuditMgm[];

    questionnaires: QuestionnaireMgm[];

    private myCompanyProfile: CompanyProfileMgm;

    constructor(
        private accountService: AccountService,
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private companyProfileService: CompanyProfileMgmService,
        private userService: UserService,
        private companyGroupService: CompanyGroupMgmService,
        private assetService: AssetMgmService,
        private threatAgentService: ThreatAgentMgmService,
        private attackStrategyService: AttackStrategyMgmService,
        private externalAuditService: ExternalAuditMgmService,
        private questionnaireService: QuestionnaireMgmService,
        private eventManager: JhiEventManager,
        private myCompanyService: MyCompanyMgmService,
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.accountService.get().subscribe((response1) => {
            const loggedAccount: Account = response1.body;
            this.userService.find(loggedAccount['login']).subscribe((response2) => {
                const user = response2.body;

                if (user) {
                    this.myCompanyService.findByUser(user.id).subscribe(
                        (response3: HttpResponse<MyCompanyMgm>) => {
                            const myCompany: MyCompanyMgm = response3.body;
                            this.myCompanyProfile = myCompany.companyProfile;
                            this.companyprofiles = [this.myCompanyProfile];
                            this.selfAssessment.companyProfile = this.myCompanyProfile;
                        },
                        (error: any) => {
                            if (error.status === 404) {
                                this.jhiAlertService.error(error.message, null, null);
                            }
                        }
                    );
                }
            });
        });

        this.isSaving = false;

        // No need to fetch all the CompanyProfiles since we already have the MyCompanyProfile of the logged user.
        /*this.companyProfileService.query()
            .subscribe((res: HttpResponse<CompanyProfileMgm[]>) => {
                this.companyprofiles = res.body;
                // Keep only the CompanyProfile for which there is a MyCompany in DB associated with the logged user.
            }, (res: HttpErrorResponse) => this.onError(res.message));*/

        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => {
                this.users = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.companyGroupService.query()
            .subscribe((res: HttpResponse<CompanyGroupMgm[]>) => {
                this.companygroups = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.assetService.query()
            .subscribe((res: HttpResponse<AssetMgm[]>) => {
                this.assets = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.threatAgentService.query()
            .subscribe((res: HttpResponse<ThreatAgentMgm[]>) => {
                this.threatagents = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.attackStrategyService.query()
            .subscribe((res: HttpResponse<AttackStrategyMgm[]>) => {
                this.attackstrategies = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.externalAuditService.query()
            .subscribe((res: HttpResponse<ExternalAuditMgm[]>) => {
                this.externalaudits = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireService.query()
            .subscribe((res: HttpResponse<QuestionnaireMgm[]>) => {
                this.questionnaires = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.selfAssessment.id !== undefined) {
            if (!this.selfAssessment.companyProfile) {
                // fetch the company profile of the logged user
                this.selfAssessment.companyProfile = this.myCompanyProfile;
            }

            this.subscribeToSaveResponse(
                this.selfAssessmentService.update(this.selfAssessment));
        } else {
            this.selfAssessment.companyProfile = this.myCompanyProfile;
            this.subscribeToSaveResponse(
                this.selfAssessmentService.create(this.selfAssessment));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SelfAssessmentMgm>>) {
        result.subscribe((res: HttpResponse<SelfAssessmentMgm>) => {
                this.onSaveSuccess(res.body);
                this.dataSharingService.updateMySelfAssessment(res.body);
            }, (res: HttpErrorResponse) => {
                this.onSaveError();
            }
        );
    }

    private onSaveSuccess(result: SelfAssessmentMgm) {
        this.eventManager.broadcast({name: 'selfAssessmentListModification', content: 'OK'});
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

    trackUserById(index: number, item: User) {
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
        private selfAssessmentPopupService: SelfAssessmentMgmPopupService,
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
                    this.selfAssessmentPopupService
                        .open(SelfAssessmentMgmDialogComponent as Component, params['id']);
                } else {
                    this.selfAssessmentPopupService
                        .open(SelfAssessmentMgmDialogComponent as Component);
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
