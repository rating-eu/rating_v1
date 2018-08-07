import * as _ from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { IdentifyAssetService } from '../identify-asset.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Principal, LoginModalService, AccountService, UserService, User } from '../../shared';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AttackStrategyMgm } from '../../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import { Observable } from 'rxjs/Observable';
import { AssetMgm, AssetMgmService } from '../../entities/asset-mgm';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { QuestionnairePurpose } from '../../entities/enumerations/QuestionnairePurpose.enum';
import { concatMap } from 'rxjs/operators/concatMap';
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

@Component({
    selector: 'jhi-identify-asset',
    templateUrl: './identify-asset.component.html',
    styles: [],
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
    questionnariesStatus: QuestionnaireStatusMgm[];
    questions: QuestionMgm[];
    myAnswers: MyAnswerMgm[];
    myAssets: MyAssetMgm[];
    myDirectAssets: DirectAssetMgm[];
    myIndirectAssets: IndirectAssetMgm[];
    questionsAnswerMap: Map<number, Array<AnswerMgm>>;

    constructor(private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private questionnairesService: QuestionnairesService,
        private questionnaireStatusService: QuestionnaireStatusMgmCustomService,
        private questionnaireStatusServices: QuestionnaireStatusMgmService,
        private questionService: QuestionMgmService,
        private myAnswerService: MyAnswerMgmService,
        private answerService: AnswerMgmService,
        private identifyAssetService: IdentifyAssetService,
        private route: ActivatedRoute,
        private assetService: AssetMgmService,
        private idaUtilsService: IdentifyAssetUtilService,
        private accountService: AccountService,
        private userService: UserService
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
        this.questions = [];
        this.questionnairesService.getAllQuestionnairesByPurpose(QuestionnairePurpose.ID_ASSETS).toPromise().then((res) => {
            if (res && res instanceof QuestionnaireMgm) {
                this.questionnaries.push(res);
            } else if (res && res instanceof Array) {
                this.questionnaries = res;
            }
            // TODO a regime rimuovere il controllo sull'enum ADMIN
            if (this.account['authorities'].includes(MyRole.ROLE_CISO)) {
                for (const qs of this.questionnaries) {
                    // controllo esistenza questionnaire status
                    // TODO a regime usare l'enum corretto ROLE_CISO
                    this.questionnaireStatusService.getByRoleSelfAssessmentAndQuestionnaire(MyRole.ROLE_CISO.toString(), this.mySelfAssessmentService.getSelfAssessment().id, qs.id)
                        .toPromise()
                        .then((status) => {
                            if (status.body) {
                                this.questionnariesStatus.push(status.body as QuestionnaireStatusMgm);
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
                        /*
                        export type EntityResponseType = HttpResponse<{
                            myAssets: MyAssetMgm[],
                            myDirectAssets: DirectAssetMgm[],
                            myIndirectAssets: IndirectAssetMgm[]
                        }>;
                        */
                       /*
                        this.myCustomAssetServices.saveAll(this.myAssets, this.myDirectAssets, this.myIndirectAssets).toPromise().then((savedAssets) =>{
                            if(savedAssets.body){
                                this.myAssets = savedAssets.body['myAssets'];
                                this.myDirectAssets = savedAssets.body['myDirectAssets'];
                                this.myIndirectAssets = savedAnswers.body['myIndirectAssets'];
                            }
                        });
                        */
                        /*
                        for (let i = 0; i < this.myAssets.length; i++) {
                            this.assetService.create(this.myAssets[i]).toPromise().then((mySavedAsset) => {
                                if (mySavedAsset.body) {
                                    this.myAssets[i] = mySavedAsset.body;
                                }
                            });
                        }
                        */
                    }
                });
            }
        });

        // SERVONO questionnariesStatus, user
        // TODO funzioni per il salvataggio
        // Salvare prima un questionnaire status        OK
        // salvare le MyAnswer                          OK
        // salvare i MyAssets
        // salvare i direct assets
        // salvare gli indirect
        // getTemporaryId() uuid::189y4861
        // (all objects)
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
