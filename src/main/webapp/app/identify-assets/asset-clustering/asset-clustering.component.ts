import * as _ from 'lodash';

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Principal, AccountService, UserService, User } from '../../shared';
import { JhiEventManager } from 'ng-jhipster';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { QuestionnairesService } from '../../questionnaires/questionnaires.service';
import { QuestionnaireStatusMgmCustomService, QuestionnaireStatusMgm } from '../../entities/questionnaire-status-mgm';
import { QuestionMgmService, QuestionMgm } from '../../entities/question-mgm';
import { MyAnswerMgmService, MyAnswerMgm } from '../../entities/my-answer-mgm';
import { IdentifyAssetUtilService } from '../identify-asset.util.service';
import { QuestionnairePurpose } from '../../entities/enumerations/QuestionnairePurpose.enum';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { MyRole } from '../../entities/enumerations/MyRole.enum';
import { Subscription } from 'rxjs';
import { AssetMgmService, AssetMgm } from '../../entities/asset-mgm';
import { AnswerMgm } from '../../entities/answer-mgm';
import { AssetType } from '../../entities/enumerations/AssetType.enum';
import { MyAssetMgm } from '../../entities/my-asset-mgm';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'asset-clustering',
    templateUrl: './asset-clustering.component.html',
    styleUrls: ['./asset-clustering.component.css'],
})

export class AssetClusteringComponent implements OnInit, OnDestroy {
    private account: Account;
    private eventSubscriber: Subscription;
    private user: User;
    private questionnaries: QuestionnaireMgm[];
    private myAnswers: MyAnswerMgm[];
    private questionnariesStatus: QuestionnaireStatusMgm[] = [];
    private questions: QuestionMgm[] = [];

    private myQuestionAnswer: MyAnswerMgm[] = [];
    private selectedAnswers: AnswerMgm[] = [];
    private myQuestionAssets: MyAssetMgm[] = [];
    private questionnaire: QuestionnaireMgm;

    public mySelf: SelfAssessmentMgm = {};
    public allAssets: AssetMgm[];
    public question: QuestionMgm;

    public intangible: AnswerMgm[] = [];
    public tangibleCurrent: AnswerMgm[] = [];
    public tangibleFixed: AnswerMgm[] = [];

    constructor(
        private eventManager: JhiEventManager,
        private principal: Principal,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private questionnairesService: QuestionnairesService,
        private questionnaireStatusService: QuestionnaireStatusMgmCustomService,
        private questionService: QuestionMgmService,
        private myAnswerService: MyAnswerMgmService,
        private idaUtilsService: IdentifyAssetUtilService,
        private accountService: AccountService,
        private userService: UserService,
        private ref: ChangeDetectorRef,
        private assetService: AssetMgmService,
    ) {
    }
    ngOnDestroy() {
        // this.eventManager.destroy(this.eventSubscriber);
    }
    ngOnInit() {
        /*
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
        // await this.assets$ = this.assetService.findAll();
        this.questionnaries = [];
        this.myAnswers = [];
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
                                this.myAnswerService.getAllByQuestionnaireStatusID(status.body.id)
                                    .toPromise().then((answers) => {
                                        if (answers.body) {
                                            this.myAnswers = answers.body;
                                        }
                                    });
                            }
                        });
                }
            }
            if (this.questionnaries && this.questionnaries.length > 0) {
                this.questions = [];
                // TODO in this phase of develop not consider there is the possibility to have more than one assets questionnaire
                // TODO check for this request many request is form trough http wrapper,
                // while many other is form in correct object type. Consider that chose only one method to procede.
                this.questionnaire = this.questionnaries[0];
                this.questionService.getQuestionsByQuestionnaire(this.questionnaries[0].id).toPromise().then((resQ) => {
                    if (resQ.body && resQ.body instanceof QuestionMgm) {
                        this.questions.push(resQ.body);
                    } else if (resQ.body && resQ.body instanceof Array) {
                        this.questions = resQ.body;
                    }
                    this.question = this.questions[0];
                    this.prepareItemForQuestions();
                    console.log(this.question);
                });
                // this.questionService.getQuestionsByQuestionnaireAndQuestionType(this.questionnaries[0].id).toPromise().then((resQ) => {
            }
        });

        this.assetService.findAll().toPromise().then((res) => {
            this.allAssets = res;
        });
        */
    }
    private prepareItemForQuestions() {
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
        console.log(this.intangible);
        console.log(this.tangibleCurrent);
        console.log(this.tangibleFixed);
    }
    registerChangeIdentifyAssets() {
        this.eventSubscriber = this.eventManager.subscribe('IdentifyAsssetsModification', (response) => this.ngOnInit());
    }

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

    private findAnswerIndex(idAnswer: number, idOffset: number): number {
        let ansId: number = undefined;
        for (const a of this.myQuestionAnswer) {
            if (a.answerOffset === idOffset && a.answer.id === idAnswer) {
                ansId = a.answer.id;
                break;
            }
        }
        if (ansId !== undefined) {
            let index = 0;
            let succ = index;
            let indexLoop = 0;
            while (indexLoop !== -1) {
                indexLoop = _.findIndex(this.selectedAnswers, { id: ansId }, succ);
                if (indexLoop !== -1) {
                    index = indexLoop;
                }
                succ = indexLoop + 1;
            }
            return index;
        }
        return -1;
    }

    public selectAssetsByCategory(ans: AnswerMgm, idOffset = 0) {
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
                    // this.idaUtilsService.removeFromMyDirectAssets(this.myQuestionAssets[indexA]);
                    // this.idaUtilsService.removeFromMyIndirectAssets(this.myQuestionAssets[indexA]);
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
                        // this.idaUtilsService.removeFromMyDirectAssets(this.myQuestionAssets[indexA]);
                        // this.idaUtilsService.removeFromMyIndirectAssets(this.myQuestionAssets[indexA]);
                        this.idaUtilsService.removeFromMyAnswerByAsset(this.myQuestionAssets[indexA]);
                        this.myQuestionAssets.splice(indexA, 1);
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
                myAsset.selfAssessment = this.mySelf;
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
                    myAsset.selfAssessment = this.mySelf;
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
                    // this.idaUtilsService.removeFromMyDirectAssets(this.myQuestionAssets[indexA]);
                    // this.idaUtilsService.removeFromMyIndirectAssets(this.myQuestionAssets[indexA]);
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
                        // this.idaUtilsService.removeFromMyDirectAssets(this.myQuestionAssets[indexA]);
                        // this.idaUtilsService.removeFromMyIndirectAssets(this.myQuestionAssets[indexA]);
                        this.idaUtilsService.removeFromMyAnswerByAsset(this.myQuestionAssets[indexA]);
                        this.myQuestionAssets.splice(indexA, 1);
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
                myAsset.selfAssessment = this.mySelf;
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
                    myAsset.selfAssessment = this.mySelf;
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
}
