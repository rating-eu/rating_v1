// tslint:disable:component-selectorù
import * as _ from 'lodash';

import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { QuestionMgm } from '../../entities/question-mgm';
import { SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { MyAnswerMgm } from '../../entities/my-answer-mgm';
import { User, AccountService, UserService } from '../../shared';
import { AnswerMgm } from '../../entities/answer-mgm';
import { AssetMgm, AssetMgmService } from '../../entities/asset-mgm';
import { AnswerType } from '../../entities/enumerations/AnswerType.enum';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { IdentifyAssetUtilService } from '../identify-asset.util.service';
import { AssetCategoryMgmService } from '../../entities/asset-category-mgm';
import { AssetType } from '../../entities/enumerations/AssetType.enum';
import { DirectAssetMgm } from '../../entities/direct-asset-mgm';
import { Subscription } from '../../../../../../node_modules/rxjs/Subscription';
import { IndirectAssetMgm } from '../../entities/indirect-asset-mgm';
import { AttackCostMgm, CostType } from '../../entities/attack-cost-mgm';
import { MyCostType } from '../../entities/enumerations/AttackCostType.enum';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'question-card',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css'],
    providers: []
})

export class QuestionComponent implements OnInit, OnDestroy {
    @Input() public question: QuestionMgm;
    @Input() public questionRenderType: string;
    @Input() public self: SelfAssessmentMgm;
    @Input() public questionnaire: QuestionnaireMgm;
    @Input() public user: User;

    public renderType: string;

    private myQuestionAnswer: MyAnswerMgm[] = [];
    private selectedAnswers: AnswerMgm[] = [];
    public intangible: AnswerMgm[] = [];
    public tangibleCurrent: AnswerMgm[] = [];
    public tangibleFixed: AnswerMgm[] = [];

    private allAssets: AssetMgm[];
    private myQuestionAssets: MyAssetMgm[] = [];
    public directGuiAssets: DirectAssetMgm[] = [];
    public indirectGuiAssets: IndirectAssetMgm[] = [];
    public indirectAnswerMap: any[] = [];

    private directAssetsSubscription: Subscription;
    private indirectAssetsSubscription: Subscription;
    private answersSubscription: Subscription;
    private indirectMapSubscription: Subscription;
    private myAssetsSubscription: Subscription;

    constructor(
        private accountService: AccountService,
        private userService: UserService,
        private assetService: AssetMgmService,
        private assetCategoryService: AssetCategoryMgmService,
        private idaUtilsService: IdentifyAssetUtilService,
        private ref: ChangeDetectorRef
    ) { }

    ngOnDestroy() {
        this.directAssetsSubscription.unsubscribe();
        this.indirectAssetsSubscription.unsubscribe();
        this.answersSubscription.unsubscribe();
        this.indirectMapSubscription.unsubscribe();
        this.myAssetsSubscription.unsubscribe();
    }

    ngOnInit() {
        this.directAssetsSubscription = this.idaUtilsService.subscribeForDirect().subscribe((res) => {
            if (res) {
                console.log(this.renderType);
                console.log(this.directGuiAssets);
                this.directGuiAssets = res;
            }
        });
        this.indirectAssetsSubscription = this.idaUtilsService.subscribeForIndirect().subscribe((res) => {
            if (res) {
                console.log(this.renderType);
                console.log(this.indirectGuiAssets);
                this.indirectGuiAssets = res;
            }
        });
        this.indirectMapSubscription = this.idaUtilsService.subscribeForIndirectMap().subscribe((res) => {
            if (res) {
                this.indirectAnswerMap = res;
                setTimeout(() => {
                    this.ref.detectChanges();
                }, 500);
                console.log(this.indirectAnswerMap);
            }
        });
        this.myAssetsSubscription = this.idaUtilsService.subscribeForMyAssets().subscribe((res) => {
            if (res && this.renderType === 'insert_magnitude') {
                this.myQuestionAssets = res;
                this.ref.detectChanges();
            }
        });

        this.answersSubscription = this.idaUtilsService.subscribeForAnswer().subscribe((res) => {
            if (res) {
                this.myQuestionAnswer = [];
                this.selectedAnswers = [];
                const linkeds = this.idaUtilsService.getMyLinkedMap();
                console.log(linkeds);
                for (const linked of linkeds) {
                    if (linked[1] === this.question.id) {
                        const indexA = _.findIndex(res, (ans) =>
                            ans.answer.id === linked[0] &&
                            ans.question.id === linked[1] &&
                            ans.answerOffset === linked[2]
                        );
                        if (indexA !== -1) {
                            this.myQuestionAnswer.push(res[indexA]);
                            this.selectedAnswers.push(res[indexA].answer);
                        }
                    }
                }
                console.log(this.myQuestionAnswer);
                console.log(this.selectedAnswers);
                // Forzare la selezione della categoria nelle domande che la prevedono... Es: Direct Assets
                // TODO controllare la deselezione dell'ultima domanda ripetuta all'interno della sezione assets indiretti
                // TODO Controllare l'evento di update dell'interfaccia
                setTimeout(() => {
                    this.ref.detectChanges();
                }, 500);
            }
        });

        if (this.questionRenderType.search('rank') !== -1) {
            this.renderType = 'select_rank';
            for (const qa of this.question.answers) {
                if (qa.asset) {
                    if (qa.asset.assetcategory.type.toString() === AssetType.INTANGIBLE.toString()) {
                        this.intangible.push(qa);
                    } else if (qa.asset.assetcategory.type.toString() === AssetType.TANGIBLE.toString()) {
                        if (qa.asset.assetcategory.name === 'Current Assets') {
                            this.tangibleCurrent.push(qa);
                        } else if (qa.asset.assetcategory.name === 'Fixed Assets') {
                            this.tangibleFixed.push(qa);
                        }
                    }
                } else if (qa.assetCategory) {
                    if (qa.assetCategory.type.toString() === AssetType.INTANGIBLE.toString()) {
                        this.intangible.push(qa);
                    } else if (qa.assetCategory.type.toString() === AssetType.TANGIBLE.toString()) {
                        if (qa.assetCategory.name === 'Current Assets') {
                            this.tangibleCurrent.push(qa);
                        } else if (qa.assetCategory.name === 'Fixed Assets') {
                            this.tangibleFixed.push(qa);
                        }
                    }
                } else {
                    continue;
                }

            }
        } else if (this.questionRenderType.search('which are the intangible and tangible assets that can be directly stolen/compromised/damaged during a cyber attack') !== -1) {
            this.renderType = 'select_direct_assets';
        } else if (this.questionRenderType.search('identify which are the other assets that could be indirectly compromised/damaged/devalued') !== -1) {
            this.renderType = 'select_indirect_assets';
        } else if (this.questionRenderType.search('estimated value of your intangible assets') !== -1) {
            this.renderType = 'estimated_assets';
        } else if (this.questionRenderType.search('share the order of magnitude') !== -1) {
            this.renderType = 'insert_magnitude';
        } else if (this.questionRenderType.search('identify the costs that the attack could generate') !== -1) {
            this.renderType = 'idetify_costs';
        }
        this.accountService.get().subscribe((response1) => {
            const account = response1.body;
            this.userService.find(account['login']).subscribe((response2) => {
                this.user = response2.body;
            });
        });
        this.assetService.findAll().toPromise().then((res) => {
            this.allAssets = res;
        });
    }
    private findAnswerIndex(idAnswer: number, idOffset: number): number {
        let ansId = 0;
        for (const a of this.myQuestionAnswer) {
            if (a.answerOffset === idOffset && a.answer.id === idAnswer) {
                ansId = a.answer.id;
                break;
            }
        }
        if (ansId !== 0) {
            let index = 0;
            let succ = index;
            for (let i = 0; i < idOffset; i++) {
                index = _.findIndex(this.selectedAnswers, { id: ansId }, succ);
                if (index === -1) {
                    break;
                }
                succ = index + 1;
            }
            return index;
        }
        return -1;
    }
    public select(ans: AnswerMgm, idOffset = 0) {
        const selectedAsset: AssetMgm | AssetMgm[] = this.findAsset(ans);
        let index;
        if (idOffset > 0) {
            index = this.findAnswerIndex(ans.id, idOffset);
        } else {
            index = _.findIndex(this.selectedAnswers, { id: ans.id });
        }
        if (index !== -1) {
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(this.myQuestionAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    this.idaUtilsService.removeFromMyAssets(this.myQuestionAssets[indexA]);
                    this.idaUtilsService.removeFromMyDirectAssets(this.myQuestionAssets[indexA]);
                    this.idaUtilsService.removeFromMyIndirectAssets(this.myQuestionAssets[indexA]);
                    this.idaUtilsService.removeFromMyAnswerByAsset(this.myQuestionAssets[indexA]);
                    this.myQuestionAssets.splice(indexA, 1);
                }
            } else {
                for (const ass of selectedAsset) {
                    const indexA = _.findIndex(this.myQuestionAssets,
                        (myAsset) => myAsset.asset.id === ass.id
                    );
                    if (indexA !== -1) {
                        this.idaUtilsService.removeFromMyAssets(this.myQuestionAssets[indexA]);
                        this.idaUtilsService.removeFromMyDirectAssets(this.myQuestionAssets[indexA]);
                        this.idaUtilsService.removeFromMyIndirectAssets(this.myQuestionAssets[indexA]);
                        this.idaUtilsService.removeFromMyAnswerByAsset(this.myQuestionAssets[indexA]);
                        this.myQuestionAssets.splice(indexA, 1);
                    }
                }
            }
            // SEZIONE NON PIù NECESSARIA, AL MOMENTO QUESTO COMPITO VIENE SVOLTO DAL SERVIZIO E DALLA SOTTOSCRIZIONE
            /*
            const indexQ = _.findIndex(this.myQuestionAnswer,
                (myAnswer) => myAnswer.answer.id === this.selectedAnswers[index].id && myAnswer.answerOffset === idOffset
            );
            if (indexQ !== -1) {
                this.idaUtilsService.removeFromMyAnswer(this.myQuestionAnswer[indexQ]);
                this.myQuestionAnswer.splice(indexQ, 1);
            }
            */
            this.selectedAnswers.splice(index, 1);
            this.idaUtilsService.sendUpdateForAnswersToSubscriptor(this.idaUtilsService.getMyAnswersComplited());
        } else {
            // genero un my asset e lo invio al servizio che si occupa di gestirli
            if (!(selectedAsset instanceof Array)) {
                const myAsset = new MyAssetMgm();
                myAsset.magnitude = undefined;
                myAsset.estimated = undefined;
                myAsset.asset = selectedAsset;
                myAsset.questionnaire = this.questionnaire;
                myAsset.ranking = undefined;
                myAsset.selfAssessment = this.self;
                this.myQuestionAssets.push(_.clone(myAsset));
                this.idaUtilsService.addMyAsset(myAsset);
            } else {
                for (const ass of selectedAsset) {
                    const myAsset = new MyAssetMgm();
                    myAsset.magnitude = undefined;
                    myAsset.estimated = undefined;
                    myAsset.asset = ass;
                    myAsset.questionnaire = this.questionnaire;
                    myAsset.ranking = undefined;
                    myAsset.selfAssessment = this.self;
                    this.myQuestionAssets.push(_.clone(myAsset));
                    this.idaUtilsService.addMyAsset(myAsset);
                }
            }
            // genero una nuova risposta e la invio al servizio che si occupa di gestirle
            const myAnswer = new MyAnswerMgm();
            myAnswer.answerOffset = idOffset;
            myAnswer.answer = ans;
            myAnswer.question = this.question;
            myAnswer.questionnaire = this.questionnaire;
            myAnswer.user = this.user;
            this.idaUtilsService.addMyAnswer(myAnswer);
            this.myQuestionAnswer.push(myAnswer);
            this.selectedAnswers.push(ans);
        }
        // console.log(this.myQuestionAssets);
        // console.log(this.selectedAnswers);
        // console.log(this.idaUtilsService.getMyAnswersComplited());
        // console.log(this.idaUtilsService.getMyAssets());
        /*console.log(this.idaUtilsService.getMyDirectAsset());
        console.log(this.idaUtilsService.getMyIndirectAsset());
        console.log(this.myQuestionAnswer);
        console.log(this.idaUtilsService.getMyAnswersComplited());*/
    }

    private findAsset(ans: AnswerMgm): AssetMgm | AssetMgm[] {
        const assetsByCategory: AssetMgm[] = [];
        if (ans.asset) {
            return ans.asset as AssetMgm;
        } else if (ans.assetCategory) {
            for (const ass of this.allAssets) {
                if (ans.assetCategory.id === ass.assetcategory.id) {
                    assetsByCategory.push(ass);
                }
            }
            return assetsByCategory as AssetMgm[];
        }
        return undefined;
    }

    public setIndirect(ans: AnswerMgm, direct: DirectAssetMgm, idOffset = 0) {
        // TODO controllare la deselezione dell'ultima domanda ripetuta all'interno della sezione assets indiretti
        // creare l'indirect   OK
        // aggiornare il direct con gli effetti
        let index;
        if (idOffset > 0) {
            index = this.findAnswerIndex(ans.id, idOffset);
        } else {
            index = _.findIndex(this.selectedAnswers, { id: ans.id });
        }
        const selectedAsset: AssetMgm | AssetMgm[] = this.findAsset(ans);
        const myGlobalAssets: MyAssetMgm[] = this.idaUtilsService.getMyAssets();
        const indexDirect = _.findIndex(myGlobalAssets,
            (myAsset) => myAsset.asset.id === (direct.asset as MyAssetMgm).asset.id
        );
        if (index !== -1) {
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(myGlobalAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    this.idaUtilsService.removeFromMyIndirectAssets(myGlobalAssets[indexA], myGlobalAssets[indexDirect]);
                    if (this.indirectGuiAssets && this.indirectGuiAssets.length > 0) {
                        const indexInd = _.findIndex(this.indirectGuiAssets, (indirect) =>
                            (indirect.directAsset as MyAssetMgm).asset.id === myGlobalAssets[indexDirect].asset.id
                        );
                        this.idaUtilsService.updateMyDirectAssets(myGlobalAssets[indexDirect], null, this.indirectGuiAssets[indexInd]);
                    }
                }
            } else {
                for (const ass of selectedAsset) {
                    const indexA = _.findIndex(myGlobalAssets,
                        (myAsset) => myAsset.asset.id === ass.id
                    );
                    if (indexA !== -1) {
                        this.idaUtilsService.removeFromMyIndirectAssets(myGlobalAssets[indexA], myGlobalAssets[indexDirect]);
                        if (this.indirectGuiAssets && this.indirectGuiAssets.length > 0) {
                            const indexInd = _.findIndex(this.indirectGuiAssets, (indirect) =>
                                (indirect.directAsset as MyAssetMgm).asset.id === myGlobalAssets[indexDirect].asset.id
                            );
                            this.idaUtilsService.updateMyDirectAssets(myGlobalAssets[indexDirect], null, this.indirectGuiAssets[indexInd]);
                        }
                    }
                }
            }
            const indexQ = _.findIndex(this.myQuestionAnswer,
                (myAnswer) =>
                    myAnswer.answer.id === this.selectedAnswers[index].id &&
                    myAnswer.answerOffset === idOffset
            );
            if (indexQ !== -1) {
                this.idaUtilsService.removeFromMyAnswer(this.myQuestionAnswer[indexQ]);
                this.myQuestionAnswer.splice(indexQ, 1);
            }
            this.selectedAnswers.splice(index, 1);
        } else {
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(myGlobalAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    this.idaUtilsService.addMyIndirectAssets(myGlobalAssets[indexA], myGlobalAssets[indexDirect]);
                    if (this.indirectGuiAssets && this.indirectGuiAssets.length > 0) {
                        const indexInd = _.findIndex(this.indirectGuiAssets, (indirect) =>
                            (indirect.directAsset as MyAssetMgm).asset.id === myGlobalAssets[indexDirect].asset.id
                        );
                        this.idaUtilsService.updateMyDirectAssets(myGlobalAssets[indexDirect], null, this.indirectGuiAssets[indexInd]);
                    }
                    const indexValues = [this.question.id, ans.id, idOffset, myGlobalAssets[indexA].asset.id, myGlobalAssets[indexDirect].asset.id];
                    this.indirectAnswerMap.push(indexValues);
                }
            } else {
                for (const ass of selectedAsset) {
                    const indexA = _.findIndex(myGlobalAssets,
                        (myAsset) => myAsset.asset.id === ass.id
                    );
                    if (indexA !== -1) {
                        this.idaUtilsService.addMyIndirectAssets(myGlobalAssets[indexA], myGlobalAssets[indexDirect]);
                        if (this.indirectGuiAssets && this.indirectGuiAssets.length > 0) {
                            const indexInd = _.findIndex(this.indirectGuiAssets, (indirect) =>
                                (indirect.directAsset as MyAssetMgm).asset.id === myGlobalAssets[indexDirect].asset.id
                            );
                            this.idaUtilsService.updateMyDirectAssets(myGlobalAssets[indexDirect], null, this.indirectGuiAssets[indexInd]);
                        }
                        const indexValues = [this.question.id, ans.id, idOffset, myGlobalAssets[indexA].asset.id, myGlobalAssets[indexDirect].asset.id];
                        this.indirectAnswerMap.push(indexValues);
                    }
                }
            }
            this.idaUtilsService.sendUpdateForIndirectMapToSubscriptor(this.indirectAnswerMap);
            // genero una nuova risposta e la invio al servizio che si occupa di gestirle
            const myAnswer = new MyAnswerMgm();
            myAnswer.answerOffset = idOffset;
            myAnswer.answer = ans;
            myAnswer.question = this.question;
            myAnswer.questionnaire = this.questionnaire;
            myAnswer.user = this.user;
            this.idaUtilsService.addMyAnswer(myAnswer);
            this.myQuestionAnswer.push(myAnswer);
            this.selectedAnswers.push(ans);
        }
    }

    public setDirect(ans: AnswerMgm, idOffset = 0) {
        let index;
        if (idOffset > 0) {
            index = this.findAnswerIndex(ans.id, idOffset);
        } else {
            index = _.findIndex(this.selectedAnswers, { id: ans.id });
        }
        const selectedAsset: AssetMgm | AssetMgm[] = this.findAsset(ans);
        const myGlobalAssets: MyAssetMgm[] = this.idaUtilsService.getMyAssets();
        if (index !== -1) {
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(myGlobalAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    this.idaUtilsService.removeFromMyDirectAssets(myGlobalAssets[indexA]);
                    this.idaUtilsService.removeFromMyIndirectAssetsByDirect(myGlobalAssets[indexA]);
                    const indirectMap = _.filter(this.indirectAnswerMap, (ind) =>
                        ind[0] === this.question.id &&
                        ind[1] === this.selectedAnswers[index].id &&
                        ind[2] === idOffset &&
                        ind[4] === myGlobalAssets[indexA]
                    );
                    for (const im of indirectMap) {
                        const indexQT = _.findIndex(this.myQuestionAnswer,
                            (myAnswer) =>
                                myAnswer.answer.id === im[1] &&
                                myAnswer.answerOffset === im[2]
                        );
                        if (indexQT !== -1) {
                            this.idaUtilsService.removeFromMyAnswer(this.myQuestionAnswer[indexQT]);
                            this.myQuestionAnswer.splice(indexQT, 1);
                        }
                    }
                    this.indirectAnswerMap = _.filter(this.indirectAnswerMap, (ind) =>
                        ind[0] === this.question.id &&
                        ind[1] === this.selectedAnswers[index].id &&
                        ind[2] === idOffset &&
                        ind[4] !== myGlobalAssets[indexA]
                    );
                    this.idaUtilsService.sendUpdateForIndirectMapToSubscriptor(this.indirectAnswerMap);
                }
            } else {
                for (const ass of selectedAsset) {
                    const indexA = _.findIndex(myGlobalAssets,
                        (myAsset) => myAsset.asset.id === ass.id
                    );
                    if (indexA !== -1) {
                        this.idaUtilsService.removeFromMyDirectAssets(myGlobalAssets[indexA]);
                        this.idaUtilsService.removeFromMyIndirectAssetsByDirect(myGlobalAssets[indexA]);
                        const indirectMap = _.filter(this.indirectAnswerMap, (ind) =>
                            ind[0] === this.question.id &&
                            ind[1] === this.selectedAnswers[index].id &&
                            ind[2] === idOffset &&
                            ind[4] === myGlobalAssets[indexA]
                        );
                        for (const im of indirectMap) {
                            const indexQT = _.findIndex(this.myQuestionAnswer,
                                (myAnswer) =>
                                    myAnswer.answer.id === im[1] &&
                                    myAnswer.answerOffset === im[2]
                            );
                            if (indexQT !== -1) {
                                this.idaUtilsService.removeFromMyAnswer(this.myQuestionAnswer[indexQT]);
                                this.myQuestionAnswer.splice(indexQT, 1);
                            }
                        }
                        this.indirectAnswerMap = _.filter(this.indirectAnswerMap, (ind) =>
                            ind[0] === this.question.id &&
                            ind[1] === this.selectedAnswers[index].id &&
                            ind[2] === idOffset &&
                            ind[4] !== myGlobalAssets[indexA]
                        );
                        this.idaUtilsService.sendUpdateForIndirectMapToSubscriptor(this.indirectAnswerMap);
                    }
                }
            }
            const indexQ = _.findIndex(this.myQuestionAnswer,
                (myAnswer) => myAnswer.answer.id === this.selectedAnswers[index].id && myAnswer.answerOffset === idOffset
            );
            if (indexQ !== -1) {
                this.idaUtilsService.removeFromMyAnswer(this.myQuestionAnswer[indexQ]);
                this.myQuestionAnswer.splice(indexQ, 1);
            }
            this.selectedAnswers.splice(index, 1);
        } else {
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(myGlobalAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    this.idaUtilsService.addMyDirectAssets(myGlobalAssets[indexA]);
                }
            } else {
                for (const ass of selectedAsset) {
                    const indexA = _.findIndex(myGlobalAssets,
                        (myAsset) => myAsset.asset.id === ass.id
                    );
                    if (indexA !== -1) {
                        this.idaUtilsService.addMyDirectAssets(myGlobalAssets[indexA]);
                    }
                }
            }
            // genero una nuova risposta e la invio al servizio che si occupa di gestirle
            const myAnswer = new MyAnswerMgm();
            myAnswer.answerOffset = idOffset;
            myAnswer.answer = ans;
            myAnswer.question = this.question;
            myAnswer.questionnaire = this.questionnaire;
            myAnswer.user = this.user;
            this.idaUtilsService.addMyAnswer(myAnswer);
            this.myQuestionAnswer.push(myAnswer);
            this.selectedAnswers.push(ans);
        }
    }

    private selectCost(ans: AnswerMgm): CostType {
        switch (ans.name) {
            case MyCostType.BEFORE_THE_ATTACK_STATUS_RESTORATION.toString(): {
                return CostType.BEFORE_THE_ATTACK_STATUS_RESTORATION;
                break;
            }
            case MyCostType.INCREASED_SECURITY.toString(): {
                return CostType.INCREASED_SECURITY;
                break;
            }
            case MyCostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES.toString(): {
                return CostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES;
                break;
            }
            case MyCostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS.toString(): {
                return CostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS;
                break;
            }
            case MyCostType.LIABILITY_COSTS.toString(): {
                return CostType.LIABILITY_COSTS;
                break;
            }
            case MyCostType.CUSTOMER_BREACH_NOTIFICATION_COSTS.toString(): {
                return CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS;
                break;
            }
            case MyCostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS.toString(): {
                return CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS;
                break;
            }
            case MyCostType.LOST_CUSTOMERS_RECOVERY.toString(): {
                return CostType.LOST_CUSTOMERS_RECOVERY;
                break;
            }
            case MyCostType.PUBLIC_RELATIONS.toString(): {
                return CostType.PUBLIC_RELATIONS;
                break;
            }
            case MyCostType.INCREASE_OF_INSURANCE_PREMIUMS.toString(): {
                return CostType.INCREASE_OF_INSURANCE_PREMIUMS;
                break;
            }
            case MyCostType.LOSS_OF_REVENUES.toString(): {
                return CostType.LOSS_OF_REVENUES;
                break;
            }
            case MyCostType.INCREASED_COST_TO_RAISE_DEBT.toString(): {
                return CostType.INCREASED_COST_TO_RAISE_DEBT;
                break;
            }
            case MyCostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES.toString(): {
                return CostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES;
                break;
            }
            case MyCostType.LOST_OR_NON_FULFILLED_CONTRACTS.toString(): {
                return CostType.LOST_OR_NON_FULFILLED_CONTRACTS;
                break;
            }
        }
    }

    public setCost(ans: AnswerMgm, idOffset = 0, direct?: DirectAssetMgm, indirect?: IndirectAssetMgm) {
        let index;
        if (idOffset > 0) {
            index = this.findAnswerIndex(ans.id, idOffset);
        } else {
            index = _.findIndex(this.selectedAnswers, { id: ans.id });
        }
        // const selectedAsset: AssetMgm | AssetMgm[] = this.findAsset(ans);
        // const myGlobalAssets: MyAssetMgm[] = this.idaUtilsService.getMyAssets();
        const myDirectAssets: DirectAssetMgm[] = this.idaUtilsService.getMyDirectAsset();
        const myIndirectAssets: IndirectAssetMgm[] = this.idaUtilsService.getMyIndirectAsset();
        const cost: AttackCostMgm = new AttackCostMgm();
        cost.type = this.selectCost(ans);
        if (direct) {
            const indexD = _.findIndex(this.directGuiAssets, (myDirect) =>
                (myDirect.asset as MyAssetMgm).asset.id === (direct.asset as MyAssetMgm).asset.id
            );
            if (indexD !== -1) {
                if (!this.directGuiAssets[indexD].costs) {
                    this.directGuiAssets[indexD].costs = [];
                }
                this.directGuiAssets[indexD].costs.push(cost);
                this.idaUtilsService.updateMyDirectAssets(this.directGuiAssets[indexD], cost);
            }
        } else if (indirect) {
            const indexI = _.findIndex(this.directGuiAssets, (myDirect) =>
                (myDirect.asset as MyAssetMgm).asset.id === (direct.asset as MyAssetMgm).asset.id
            );
            if (indexI !== -1) {
                if (!this.directGuiAssets[indexI].costs) {
                    this.directGuiAssets[indexI].costs = [];
                }
                this.directGuiAssets[indexI].costs.push(cost);
                this.idaUtilsService.updateMyDirectAssets(this.directGuiAssets[indexI], cost);
            }
        }
        if (index !== -1) {
            const indexQ = _.findIndex(this.myQuestionAnswer,
                (myAnswer) => myAnswer.answer.id === this.selectedAnswers[index].id && myAnswer.answerOffset === idOffset
            );
            if (indexQ !== -1) {
                this.idaUtilsService.removeFromMyAnswer(this.myQuestionAnswer[indexQ]);
                this.myQuestionAnswer.splice(indexQ, 1);
            }
            this.selectedAnswers.splice(index, 1);
        } else {
            // genero una nuova risposta e la invio al servizio che si occupa di gestirle
            const myAnswer = new MyAnswerMgm();
            myAnswer.answerOffset = idOffset;
            myAnswer.answer = ans;
            myAnswer.question = this.question;
            myAnswer.questionnaire = this.questionnaire;
            myAnswer.user = this.user;
            this.idaUtilsService.addMyAnswer(myAnswer);
            this.myQuestionAnswer.push(myAnswer);
            this.selectedAnswers.push(ans);
        }
    }

    public setMagnitude(asset: MyAssetMgm, idOffset = 0, value: string) {
        if (value === '') {
            value = undefined;
        }
        const myGlobalAssets: MyAssetMgm[] = this.idaUtilsService.getMyAssets();
        const indexAsset = _.findIndex(myGlobalAssets, (myAsset) =>
            myAsset.asset.id === asset.asset.id
        );
        if (indexAsset !== -1) {
            myGlobalAssets[indexAsset].magnitude = value;
            this.idaUtilsService.updateMyAssets(this.myQuestionAssets[indexAsset], 'magnitude');
            const indexMQA = _.findIndex(this.myQuestionAssets, (myAsset) =>
                myAsset.asset.id === asset.asset.id
            );
            if (indexMQA !== -1) {
                this.myQuestionAssets.splice(indexMQA, 1, myGlobalAssets[indexAsset]);
            }
        }
    }

    public setEstimated(ans: AnswerMgm, idOffset = 0) {
        let index;
        if (idOffset > 0) {
            index = this.findAnswerIndex(ans.id, idOffset);
        } else {
            index = _.findIndex(this.selectedAnswers, { id: ans.id });
        }
        const selectedAsset: AssetMgm | AssetMgm[] = this.findAsset(ans);
        const myGlobalAssets: MyAssetMgm[] = this.idaUtilsService.getMyAssets();
        if (index !== -1) {
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(myGlobalAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    myGlobalAssets[indexA].estimated = false;
                    const indexMQA = _.findIndex(this.myQuestionAssets,
                        (myQAsset) => myQAsset.asset.id === selectedAsset.id
                    );
                    if (indexMQA === -1) {
                        this.myQuestionAssets.push(myGlobalAssets[indexA]);
                    } else {
                        this.myQuestionAssets.splice(indexMQA, 1, myGlobalAssets[indexA]);
                    }
                    this.idaUtilsService.updateMyAssets(this.myQuestionAssets[indexA], 'estimated');
                }
            } else {
                for (const ass of selectedAsset) {
                    const indexA = _.findIndex(myGlobalAssets,
                        (myAsset) => myAsset.asset.id === ass.id
                    );
                    if (indexA !== -1) {
                        myGlobalAssets[indexA].estimated = false;
                        const indexMQA = _.findIndex(this.myQuestionAssets,
                            (myQAsset) => myQAsset.asset.id === ass.id
                        );
                        if (indexMQA === -1) {
                            this.myQuestionAssets.push(myGlobalAssets[indexA]);
                        } else {
                            this.myQuestionAssets.splice(indexMQA, 1, myGlobalAssets[indexA]);
                        }
                        this.idaUtilsService.updateMyAssets(this.myQuestionAssets[indexA], 'estimated');
                    }
                }
            }
            const indexQ = _.findIndex(this.myQuestionAnswer,
                (myAnswer) => myAnswer.answer.id === this.selectedAnswers[index].id && myAnswer.answerOffset === idOffset
            );
            if (indexQ !== -1) {
                this.idaUtilsService.removeFromMyAnswer(this.myQuestionAnswer[indexQ]);
                this.myQuestionAnswer.splice(indexQ, 1);
            }
            this.selectedAnswers.splice(index, 1);
        } else {
            if (!(selectedAsset instanceof Array)) {
                const indexA = _.findIndex(myGlobalAssets,
                    (myAsset) => myAsset.asset.id === selectedAsset.id
                );
                if (indexA !== -1) {
                    myGlobalAssets[indexA].estimated = true;
                    const indexMQA = _.findIndex(this.myQuestionAssets,
                        (myQAsset) => myQAsset.asset.id === selectedAsset.id
                    );
                    if (indexMQA === -1) {
                        this.myQuestionAssets.push(myGlobalAssets[indexA]);
                    } else {
                        this.myQuestionAssets.splice(indexMQA, 1, myGlobalAssets[indexA]);
                    }
                    this.idaUtilsService.updateMyAssets(this.myQuestionAssets[indexA], 'estimated');
                }
            } else {
                for (const ass of selectedAsset) {
                    const indexA = _.findIndex(myGlobalAssets,
                        (myAsset) => myAsset.asset.id === ass.id
                    );
                    if (indexA !== -1) {
                        myGlobalAssets[indexA].estimated = true;
                        const indexMQA = _.findIndex(this.myQuestionAssets,
                            (myQAsset) => myQAsset.asset.id === ass.id
                        );
                        if (indexMQA === -1) {
                            this.myQuestionAssets.push(myGlobalAssets[indexA]);
                        } else {
                            this.myQuestionAssets.splice(indexMQA, 1, myGlobalAssets[indexA]);
                        }
                        this.idaUtilsService.updateMyAssets(this.myQuestionAssets[indexA], 'estimated');
                    }
                }
            }
            // genero una nuova risposta e la invio al servizio che si occupa di gestirle
            const myAnswer = new MyAnswerMgm();
            myAnswer.answerOffset = idOffset;
            myAnswer.answer = ans;
            myAnswer.question = this.question;
            myAnswer.questionnaire = this.questionnaire;
            myAnswer.user = this.user;
            this.idaUtilsService.addMyAnswer(myAnswer);
            this.myQuestionAnswer.push(myAnswer);
            this.selectedAnswers.push(ans);

            console.log(this.idaUtilsService.getMyAssets());
        }
        this.idaUtilsService.sendUpdateForMyAssetsToSubscriptor(this.idaUtilsService.getMyAssets());
    }

    public isEstimated(ans: AnswerMgm) {
        const selectedAsset = this.findAsset(ans);
        const myGlobalAssets: MyAssetMgm[] = this.idaUtilsService.getMyAssets();
        if (!(selectedAsset instanceof Array)) {
            const indexA = _.findIndex(this.myQuestionAssets,
                (myAsset) => myAsset.asset.id === selectedAsset.id
            );
            if (indexA !== -1) {
                if (this.myQuestionAssets[indexA].estimated) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            const indexA = _.findIndex(this.myQuestionAssets,
                (myAsset) => myAsset.asset.id === selectedAsset[0].id
            );
            if (indexA !== -1) {
                if (this.myQuestionAssets[indexA].estimated) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    public setRank(ans: AnswerMgm, rank: number) {
        const selectedAsset = this.findAsset(ans);
        if (!(selectedAsset instanceof Array)) {
            const indexA = _.findIndex(this.myQuestionAssets,
                (myAsset) => myAsset.asset.id === selectedAsset.id
            );
            if (indexA !== -1) {
                this.myQuestionAssets[indexA].ranking = rank;
                this.idaUtilsService.updateMyAssets(this.myQuestionAssets[indexA], 'ranking');
            }
        } else {
            for (const sA of selectedAsset) {
                const indexA = _.findIndex(this.myQuestionAssets,
                    (myAsset) => myAsset.asset.id === sA.id
                );
                if (indexA !== -1) {
                    this.myQuestionAssets[indexA].ranking = rank;
                    this.idaUtilsService.updateMyAssets(this.myQuestionAssets[indexA], 'ranking');
                }
            }
        }
        // console.log(this.idaUtilsService.getMyAssets());
    }

    public whichRank(ans: AnswerMgm, rank: number): boolean {
        const selectedAsset = this.findAsset(ans);
        if (!(selectedAsset instanceof Array)) {
            const indexA = _.findIndex(this.myQuestionAssets,
                (myAsset) => myAsset.asset.id === selectedAsset.id
            );
            if (indexA !== -1) {
                if (this.myQuestionAssets[indexA].ranking === rank) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            const indexA = _.findIndex(this.myQuestionAssets,
                (myAsset) => myAsset.asset.id === selectedAsset[0].id
            );
            if (indexA !== -1) {
                if (this.myQuestionAssets[indexA].ranking === rank) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    // TODO CONTROLLARE QUESTA FUZNIONE
    public isSelected(ans: AnswerMgm, idOffset = 0): boolean {
        for (const a of this.myQuestionAnswer) {
            if (a.answerOffset === idOffset && a.answer.id === ans.id) {
                return true;
            }
        }
        return false;
    }

    public isSelectable(ans: AnswerMgm): boolean {
        const selectableAsset: AssetMgm | AssetMgm[] = this.findAsset(ans);
        const myGlobalAssets: MyAssetMgm[] = this.idaUtilsService.getMyAssets();
        if (selectableAsset) {
            if (!(selectableAsset instanceof Array)) {
                const indexA = _.findIndex(myGlobalAssets,
                    (myAsset) => myAsset.asset.id === selectableAsset.id
                );
                if (indexA !== -1) {
                    return true;
                }
            } else {
                for (const ass of selectableAsset) {
                    const indexA = _.findIndex(myGlobalAssets,
                        (myAsset) => myAsset.asset.id === ass.id
                    );
                    if (indexA !== -1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}
