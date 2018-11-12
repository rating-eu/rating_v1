import * as _ from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Principal, LoginModalService, AccountService, UserService, User } from '../../shared';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Subscription } from 'rxjs/Subscription';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { QuestionnairePurpose } from '../../entities/enumerations/QuestionnairePurpose.enum';
import { QuestionnairesService } from '../../questionnaires/questionnaires.service';
import { IdentifyAssetUtilService } from '../identify-asset.util.service';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { DirectAssetMgm } from '../../entities/direct-asset-mgm';
import { IndirectAssetMgm } from '../../entities/indirect-asset-mgm';
import { QuestionnaireStatusMgmService, QuestionnaireStatusMgm, Role, QuestionnaireStatusMgmCustomService } from '../../entities/questionnaire-status-mgm';
import { MyRole } from '../../entities/enumerations/MyRole.enum';
import { AssetMgm } from '../../entities/asset-mgm';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'asset-clustering',
    templateUrl: './asset-clustering.component.html',
    styleUrls: ['./asset-clustering.component.css'],
})

export class AssetClusteringComponent implements OnInit, OnDestroy {
    private account: Account;
    private user: User;
    private eventSubscriber: Subscription;
    private questionnaries: QuestionnaireMgm[];
    private questionnariesStatus: QuestionnaireStatusMgm[] = [];

    public mySelf: SelfAssessmentMgm = {};
    public assets: AssetMgm[];
    public loading = false;
    public loadWithErrors = false;
    public myAssets: MyAssetMgm[];
    public myDirectAssets: DirectAssetMgm[];
    public myIndirectAssets: IndirectAssetMgm[];

    constructor(
        private principal: Principal,
        private accountService: AccountService,
        private userService: UserService,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private eventManager: JhiEventManager,
        private idaUtilsService: IdentifyAssetUtilService,
        private questionnairesService: QuestionnairesService,
        private questionnaireStatusService: QuestionnaireStatusMgmCustomService,
        private questionnaireStatusServices: QuestionnaireStatusMgmService,
    ) { }

    ngOnDestroy() {
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
        this.loading = true;
        this.idaUtilsService.getMySavedAssets(this.mySelf)
            .toPromise()
            .then((mySavedAssets) => {
                if (mySavedAssets) {
                    console.log(mySavedAssets);
                    if (mySavedAssets.length === 0) {
                        this.loading = false;
                        this.loadWithErrors = false;
                        return;
                    }
                    this.myAssets = mySavedAssets;
                } else {
                    this.loading = false;
                    this.loadWithErrors = false;
                }
            });
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
                                // this.ref.detectChanges();
                            } else {
                                this.loading = false;
                                this.loadWithErrors = false;
                            }
                        }).catch(() => {
                            this.loading = false;
                            this.loadWithErrors = false;
                        });
                }
            }
        });
    }

    registerChangeIdentifyAssets() {
        this.eventSubscriber = this.eventManager.subscribe('IdentifyAsssetsModification', (response) => this.ngOnInit());
    }

    private findAsset(assetId?: number, categoryId?: number): AssetMgm | AssetMgm[] {
        if (assetId) {
            return _.find(this.assets, { id: assetId }) as AssetMgm;
        } else if (categoryId) {
            const assetsByCategory: AssetMgm[] = [];
            for (const ass of this.assets) {
                if (categoryId === ass.assetcategory.id) {
                    assetsByCategory.push(ass);
                }
            }
            return assetsByCategory as AssetMgm[];
        }
        return undefined;
    }

    public select(assetId?: number, categoryId?: number) {
        const selectedAsset: AssetMgm | AssetMgm[] = this.findAsset(assetId, categoryId);
        if (selectedAsset instanceof Array) {
            for (const asset of selectedAsset) {
                const i = _.findIndex(this.myAssets,
                    (myAsset) => myAsset.asset.id === asset.id
                );
                if (i !== -1) {
                    this.myAssets.splice(i, 1);
                } else {
                    const newAsset: MyAssetMgm = {};
                    newAsset.asset = asset;
                    // TODO pensare ad una politica futura di selezione del questionario
                    newAsset.questionnaire = this.questionnaries[0];
                    newAsset.selfAssessment = this.mySelf;
                    newAsset.economicValue = undefined;
                    newAsset.estimated = undefined;
                    newAsset.impact = undefined;
                    newAsset.magnitude = undefined;
                    newAsset.ranking = undefined;
                    this.myAssets.push(newAsset);
                }
            }
        } else {
            const index = _.findIndex(this.myAssets,
                (myAsset) => myAsset.asset.id === selectedAsset.id
            );
            if (index !== -1) {
                this.myAssets.splice(index, 1);
            } else {
                const newAsset: MyAssetMgm = {};
                newAsset.asset = selectedAsset;
                // TODO pensare ad una politica futura di selezione del questionario
                newAsset.questionnaire = this.questionnaries[0];
                newAsset.selfAssessment = this.mySelf;
                newAsset.economicValue = undefined;
                newAsset.estimated = undefined;
                newAsset.impact = undefined;
                newAsset.magnitude = undefined;
                newAsset.ranking = undefined;
                this.myAssets.push(newAsset);
            }
        }
    }

    public isSelect(assetId?: number, categoryId?: number):boolean{

    }
}
