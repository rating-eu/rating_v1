import * as _ from 'lodash';

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Principal, LoginModalService, AccountService, UserService, User } from '../../shared';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Subscription } from 'rxjs/Subscription';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { QuestionnairePurpose } from '../../entities/enumerations/QuestionnairePurpose.enum';
import { QuestionnairesService } from '../../questionnaires/questionnaires.service';
import { IdentifyAssetUtilService } from '../identify-asset.util.service';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { AssetCategoryMgm } from './../../entities/asset-category-mgm/asset-category-mgm.model';
import { QuestionnaireStatusMgmService, QuestionnaireStatusMgm, Role, QuestionnaireStatusMgmCustomService } from '../../entities/questionnaire-status-mgm';
import { MyRole } from '../../entities/enumerations/MyRole.enum';
import { AssetMgm } from '../../entities/asset-mgm';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'asset-clustering',
    templateUrl: './asset-clustering.component.html',
    styleUrls: ['./asset-clustering.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetClusteringComponent implements OnInit, OnDestroy {
    private account: Account;
    private user: User;
    private eventSubscriber: Subscription;
    private questionnaries: QuestionnaireMgm[];
    private questionnariesStatus: QuestionnaireStatusMgm[] = [];

    public mySelf: SelfAssessmentMgm = {};
    public assets: AssetMgm[];
    public myAssets: MyAssetMgm[];
    public categoryToAssets: Map<AssetCategoryMgm, AssetMgm[]> = new Map<AssetCategoryMgm, AssetMgm[]>();
    public categories: AssetCategoryMgm[];
    public selectedCategory: AssetCategoryMgm;
    public updateMyAssets = false;
    public isDescriptionCollapsed = true;
    public loading = false;

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
        private ref: ChangeDetectorRef,
        private router: Router
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
        this.idaUtilsService.getAllAssets().toPromise().then((systemAssets) => {
            if (systemAssets) {
                this.assets = systemAssets;
                for (const asset of this.assets) {
                    let find = false;
                    this.categoryToAssets.forEach((v, k) => {
                        if (k.id === asset.assetcategory.id) {
                            let items = this.categoryToAssets.get(k);
                            items.push(asset);
                            items = _.orderBy(items, ['name'], ['asc']);
                            this.categoryToAssets.set(k, items);
                            find = true;
                        }
                    });
                    if (!find) {
                        this.categoryToAssets.set(asset.assetcategory, [asset]);
                    }
                }
                this.categories = Array.from(this.categoryToAssets.keys());
                this.categories = _.orderBy(this.categories, ['name'], ['asc']);
                const tempMap: Map<AssetCategoryMgm, AssetMgm[]> = new Map<AssetCategoryMgm, AssetMgm[]>();
                this.categories.forEach((category) => {
                    tempMap.set(category, this.categoryToAssets.get(category));
                });
                this.categoryToAssets = tempMap;
                this.idaUtilsService.getMySavedAssets(this.mySelf).toPromise().then((mySavedAssets) => {
                    if (mySavedAssets) {
                        this.myAssets = mySavedAssets;
                    }
                    this.ref.detectChanges();
                }).catch(() => {
                    this.ref.detectChanges();
                });
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
                            }
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

    public selectCategory(category: AssetCategoryMgm) {
        if (category) {
            if (this.selectedCategory) {
                if (this.selectedCategory.id === category.id) {
                    this.selectedCategory = null;
                } else {
                    this.selectedCategory = category;
                }
            } else {
                this.selectedCategory = category;
            }
        }
        this.ref.detectChanges();
    }

    public select(assetId?: number, categoryId?: number) {
        const selectedAsset: AssetMgm | AssetMgm[] = this.findAsset(assetId, categoryId);
        if (!this.myAssets) {
            this.myAssets = [];
        }
        if (selectedAsset instanceof Array) {
            const assetInSelection = this.howManyAssetInSelection(categoryId);
            // const indexCategory = _.findIndex(this.categories, { id: categoryId });
            if (assetInSelection !== 0) {
                for (const asset of selectedAsset) {
                    const i = _.findIndex(this.myAssets,
                        (myAsset) => myAsset.asset.id === asset.id
                    );
                    if (i !== -1) {
                        this.myAssets.splice(i, 1);
                        this.updateMyAssets = true;
                    }
                }
            } else {
                for (const asset of selectedAsset) {
                    const i = _.findIndex(this.myAssets,
                        (myAsset) => myAsset.asset.id === asset.id
                    );
                    if (i === -1) {
                        const newAsset: MyAssetMgm = {};
                        newAsset.asset = asset;
                        newAsset.questionnaire = this.questionnaries[0];
                        newAsset.selfAssessment = this.mySelf;
                        newAsset.economicValue = undefined;
                        newAsset.estimated = undefined;
                        newAsset.impact = undefined;
                        newAsset.ranking = 1;
                        this.myAssets.push(newAsset);
                        this.updateMyAssets = true;
                    }
                }
            }
        } else {
            const index = _.findIndex(this.myAssets,
                (myAsset) => myAsset.asset.id === selectedAsset.id
            );
            if (index !== -1) {
                this.myAssets.splice(index, 1);
                this.updateMyAssets = true;
            } else {
                const newAsset: MyAssetMgm = {};
                newAsset.asset = selectedAsset;
                // TODO pensare ad una politica futura di selezione del questionario
                newAsset.questionnaire = this.questionnaries[0];
                newAsset.selfAssessment = this.mySelf;
                newAsset.economicValue = undefined;
                newAsset.estimated = undefined;
                newAsset.impact = undefined;
                newAsset.ranking = 1;
                this.myAssets.push(newAsset);
                this.updateMyAssets = true;
            }
        }
        this.ref.detectChanges();
    }
    public howManyAssetInSelection(categoryId: number): number {
        if (!this.myAssets) {
            return 0;
        }
        let categoryAssets: AssetMgm[] = [];
        this.categoryToAssets.forEach((v, k) => {
            if (k.id === categoryId) {
                categoryAssets = v;
            }
        });
        let howManyAsset = 0;
        for (const myAsset of this.myAssets) {
            const index = _.findIndex(categoryAssets, { id: myAsset.asset.id });
            if (index !== -1) {
                howManyAsset++;
            }
        }
        return howManyAsset;
    }

    public isSelect(assetId?: number, categoryId?: number): boolean {
        if (!this.myAssets) {
            return false;
        }
        if (assetId) {
            for (const myAsset of this.myAssets) {
                if (myAsset.asset.id === assetId) {
                    return true;
                }
            }
        } else if (categoryId) {
            let categoryAssets: AssetMgm[] = [];
            this.categoryToAssets.forEach((v, k) => {
                if (k.id === categoryId) {
                    categoryAssets = v;
                }
            });
            let howManyAsset = 0;
            for (const myAsset of this.myAssets) {
                const index = _.findIndex(categoryAssets, { id: myAsset.asset.id });
                if (index !== -1) {
                    howManyAsset++;
                }
            }
            if (howManyAsset === categoryAssets.length) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    public saveMyAsset() {
        console.log(this.myAssets);
        this.loading = true;
        if (this.updateMyAssets) {
            this.idaUtilsService.createUpdateMyAssets(this.mySelf, this.myAssets).toPromise().then((myAssets) => {
                if (myAssets) {
                    this.myAssets = myAssets;
                }
                this.loading = false;
                this.router.navigate(['/identify-asset/cascade-effects']);
            });
        } else {
            this.loading = false;
            this.router.navigate(['/identify-asset/cascade-effects']);
        }
    }
}
