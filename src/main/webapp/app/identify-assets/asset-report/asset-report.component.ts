import * as _ from 'lodash';

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { QuestionnaireStatusMgm, QuestionnaireStatusMgmCustomService } from '../../entities/questionnaire-status-mgm';
import { Principal, AccountService, UserService, User } from '../../shared';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { QuestionnairesService } from '../../questionnaires/questionnaires.service';
import { QuestionnairePurpose } from '../../entities/enumerations/QuestionnairePurpose.enum';
import { MyRole } from '../../entities/enumerations/MyRole.enum';
import { IdentifyAssetUtilService } from '../identify-asset.util.service';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { DirectAssetMgm } from '../../entities/direct-asset-mgm';
import { IndirectAssetMgm } from '../../entities/indirect-asset-mgm';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'asset-report',
    templateUrl: './asset-report.component.html',
    styleUrls: ['./asset-report.component.css'],
})

export class AssetReportComponent implements OnInit, OnDestroy {
    public questionnariesStatus: QuestionnaireStatusMgm[] = [];
    public mySelf: SelfAssessmentMgm = {};
    public myDirectAssets: DirectAssetMgm[];
    public myIndirectAssets: IndirectAssetMgm[];
    public directAssetSelected: DirectAssetMgm;
    public indirectAssetSelected: IndirectAssetMgm;

    private questionnaries: QuestionnaireMgm[];
    private account: Account;
    private user: User;
    private eventSubscriber: Subscription;

    constructor(
        private principal: Principal,
        private accountService: AccountService,
        private userService: UserService,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager,
        private questionnairesService: QuestionnairesService,
        private questionnaireStatusService: QuestionnaireStatusMgmCustomService,
        private ref: ChangeDetectorRef,
        private idaUtilsService: IdentifyAssetUtilService,
    ) {

    }
    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.accountService.get().subscribe((response1) => {
            const loggedAccount = response1.body;
            this.userService.find(loggedAccount['login']).subscribe((response2) => {
                this.user = response2.body;
            });
        });
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.registerChangeIdentifyAssets();
        this.questionnaries = [];
        // this.myAnswers = [];
        this.questionnairesService.getAllQuestionnairesByPurpose(QuestionnairePurpose.ID_ASSETS).toPromise().then((res) => {
            if (res && res instanceof QuestionnaireMgm) {
                this.questionnaries.push(res);
            } else if (res && res instanceof Array) {
                this.questionnaries = res;
            }
            if (this.account['authorities'].includes(MyRole.ROLE_CISO) && this.mySelf) {
                for (const qs of this.questionnaries) {
                    // controllo esistenza questionnaire status
                    this.questionnaireStatusService.getByRoleSelfAssessmentAndQuestionnaire(MyRole.ROLE_CISO.toString(), this.mySelfAssessmentService.getSelfAssessment().id, qs.id)
                        .toPromise()
                        .then((status) => {
                            if (status.body) {
                                this.questionnariesStatus.push(status.body as QuestionnaireStatusMgm);
                                this.ref.detectChanges();
                                this.idaUtilsService.getMySavedDirectAssets(this.mySelf)
                                    .toPromise().then((mySavedDirects) => {
                                        this.myDirectAssets = mySavedDirects;
                                        console.log(this.myDirectAssets);
                                        this.idaUtilsService.getMySavedIndirectAssets(this.mySelf)
                                            .toPromise().then((mySavedIndirects) => {
                                                this.myIndirectAssets = mySavedIndirects;
                                                for (let i = 0; i < this.myDirectAssets.length; i++) {
                                                    this.myDirectAssets[i].effects =
                                                        this.idaUtilsService.getSavedIndirectFromDirect(this.myDirectAssets[i], this.myIndirectAssets);
                                                }
                                                console.log(this.myDirectAssets);
                                                console.log(this.myIndirectAssets);
                                                this.ref.detectChanges();
                                            });
                                    });
                            }
                        });
                }
            }
        });
    }

    registerChangeIdentifyAssets() {
        this.eventSubscriber = this.eventManager.subscribe('IdentifyAsssetsModification', (response) => this.ngOnInit());
    }

    public selectDirectAsset(direct: DirectAssetMgm) {
        if (this.directAssetSelected) {
            if (this.directAssetSelected.id === direct.id) {
                this.directAssetSelected = null;
                this.indirectAssetSelected = null;
            } else {
                this.directAssetSelected = direct;
                this.indirectAssetSelected = null;
            }
        } else {
            this.directAssetSelected = direct;
            this.indirectAssetSelected = null;
        }
    }

    public selectIndirectAsset(indirect: IndirectAssetMgm) {
        if (this.indirectAssetSelected) {
            if (this.indirectAssetSelected.id === indirect.id) {
                this.indirectAssetSelected = null;
            } else {
                this.indirectAssetSelected = indirect;
            }
        } else {
            this.indirectAssetSelected = indirect;
        }
    }

    public isAssetTreeShow(direct: DirectAssetMgm): boolean {
        if (this.directAssetSelected) {
            if (this.directAssetSelected.id === direct.id) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }
}
