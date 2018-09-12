import * as _ from 'lodash';

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IdentifyAssetService } from '../identify-asset.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Principal, LoginModalService, AccountService, UserService, User } from '../../shared';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AttackStrategyMgm } from '../../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { QuestionnairePurpose } from '../../entities/enumerations/QuestionnairePurpose.enum';
import { QuestionnairesService } from '../../questionnaires/questionnaires.service';
import { QuestionMgm, QuestionMgmService } from '../../entities/question-mgm';
import { AnswerMgm, AnswerMgmService } from '../../entities/answer-mgm';
import { MyAnswerMgmService, MyAnswerMgm } from '../../entities/my-answer-mgm';
import { QuestionnaireStatusMgmService, QuestionnaireStatusMgm, Role, QuestionnaireStatusMgmCustomService } from '../../entities/questionnaire-status-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { IdentifyAssetUtilService } from '../identify-asset.util.service';
import { MyRole } from '../../entities/enumerations/MyRole.enum';
import { DirectAssetMgm } from '../../entities/direct-asset-mgm';
import { IndirectAssetMgm } from '../../entities/indirect-asset-mgm';
import { Status } from '../../entities/enumerations/QuestionnaireStatus.enum';
import { AssetsOneShot } from '../model/AssetsOneShot.model';
import { AttackCostMgm, CostType } from '../../entities/attack-cost-mgm';
import { MyCostType } from '../../entities/enumerations/AttackCostType.enum';

@Component({
    selector: 'jhi-identify-asset',
    templateUrl: './identify-asset.component.html',
    styleUrls: ['./identify-asset.component.css'],
    providers: [IdentifyAssetService]
})

export class IdentifyAssetComponent implements OnInit, OnDestroy {
    account: Account;
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    mySelf: SelfAssessmentMgm = {};
    // assets$: Observable<AssetMgm[]>;
    user: User;

    questionnaries: QuestionnaireMgm[];
    questionnariesStatus: QuestionnaireStatusMgm[] = [];
    questions: QuestionMgm[] = [];
    myAnswers: MyAnswerMgm[];
    myAssets: MyAssetMgm[];
    myDirectAssets: DirectAssetMgm[];
    myIndirectAssets: IndirectAssetMgm[];
    questionsAnswerMap: Map<number, Array<AnswerMgm>>;

    directAssetSelected: DirectAssetMgm;
    indirectAssetSelected: IndirectAssetMgm;
    attackCostType = MyCostType;

    constructor(private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private questionnairesService: QuestionnairesService,
        private questionnaireStatusService: QuestionnaireStatusMgmCustomService,
        private questionnaireStatusServices: QuestionnaireStatusMgmService,
        private questionService: QuestionMgmService,
        private myAnswerService: MyAnswerMgmService,
        private router: Router,
        private idaUtilsService: IdentifyAssetUtilService,
        private accountService: AccountService,
        private userService: UserService,
        private ref: ChangeDetectorRef
    ) {
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
                                // this.questionnariesStatus.push(status.body as QuestionnaireStatusMgm);
                                this.ref.detectChanges();
                                this.myAnswerService.getAllByQuestionnaireStatusID(status.body.id)
                                    .toPromise().then((answers) => {
                                        if (answers.body) {
                                            this.myAnswers = answers.body;
                                            this.idaUtilsService.getMySavedAssets(this.mySelf)
                                                .toPromise()
                                                .then((mySavedAssets) => {
                                                    if (mySavedAssets) {
                                                        this.myAssets = mySavedAssets;
                                                        // Decommentare il codice di seguito quando saranno pronti i relativi servizi
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
                this.questionService.getQuestionsByQuestionnaire(this.questionnaries[0].id).toPromise().then((resQ) => {
                    if (resQ.body && resQ.body instanceof QuestionMgm) {
                        this.questions.push(resQ.body);
                    } else if (resQ.body && resQ.body instanceof Array) {
                        this.questions = resQ.body;
                    }
                });
            }
        });
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

    public sendAnswerAndSaveMyAssets() {
        this.myAnswers = this.idaUtilsService.getMyAnswersComplited();
        this.myAssets = this.idaUtilsService.getMyAssets();
        this.myDirectAssets = this.idaUtilsService.getMyDirectAsset();
        this.myIndirectAssets = this.idaUtilsService.getMyIndirectAsset();
        console.log(this.myAnswers);
        console.log(this.myAssets);
        console.log(this.myDirectAssets);
        console.log(this.myIndirectAssets);
        let status: QuestionnaireStatusMgm = new QuestionnaireStatusMgm();
        status.selfAssessment = this.mySelf;
        status.questionnaire = this.questionnaries[0];
        status.role = Role.ROLE_CISO;
        const dateString = new Date().toISOString();
        status.created = dateString;
        status.modified = dateString;
        status.user = this.user;
        status.status = Status.FULL;
        this.questionnaireStatusServices.create(status).toPromise().then((receivedStatus) => {
            if (receivedStatus.body) {
                status = receivedStatus.body;
                for (const ans of this.myAnswers) {
                    ans.questionnaireStatus = status;
                }
                this.myAnswerService.createAll(this.myAnswers).toPromise().then((savedAnswers) => {
                    if (savedAnswers.body) {
                        this.myAnswers = savedAnswers.body;
                    }
                });
            }
        });
        const bundle: AssetsOneShot = new AssetsOneShot();
        bundle.myAssets = this.myAssets;
        bundle.directAssets = this.myDirectAssets;
        bundle.indirectAssets = this.myIndirectAssets;
        this.idaUtilsService.oneShotSave(bundle).toPromise().then((savedAssets) => {
            if (savedAssets) {
                this.myAssets = savedAssets.myAssets;
                this.myDirectAssets = savedAssets.directAssets;
                this.myIndirectAssets = savedAssets.indirectAssets;
            }
            this.router.navigate(['/']);
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AttackStrategyMgm) {
        return item.id;
    }

    registerChangeIdentifyAssets() {
        this.eventSubscriber = this.eventManager.subscribe('IdentifyAsssetsModification', (response) => this.ngOnInit());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    previousState() {
        window.history.back();
    }
}
