import * as _ from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { IdentifyAssetService } from '../identify-asset.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Principal, LoginModalService } from '../../shared';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AttackStrategyMgm } from '../../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import { Observable } from 'rxjs/Observable';
import { AssetMgm, AssetMgmService } from '../../entities/asset-mgm';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { HttpResponse, HttpErrorResponse } from '../../../../../../node_modules/@angular/common/http';
import { QuestionnairePurpose } from '../../entities/enumerations/QuestionnairePurpose.enum';
import { concatMap } from '../../../../../../node_modules/rxjs/operators/concatMap';
import { QuestionnairesService } from '../../questionnaires/questionnaires.service';
import { QuestionMgm, QuestionMgmService } from '../../entities/question-mgm';
import { AnswerMgm, AnswerMgmService } from '../../entities/answer-mgm';
import { MyAnswerMgmService, MyAnswerMgm } from '../../entities/my-answer-mgm';
import { QuestionnaireStatusMgmService } from '../../entities/questionnaire-status-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { IdentifyAssetUtilService } from '../identify-asset.util.service';

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
    assets$: Observable<AssetMgm[]>;

    questionnaries: QuestionnaireMgm[];
    questions: QuestionMgm[];
    myAnswers: MyAnswerMgm[];
    myAssets: MyAssetMgm[];
    questionsAnswerMap: Map<number, Array<AnswerMgm>>;

    constructor(private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private questionnairesService: QuestionnairesService,
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        private questionService: QuestionMgmService,
        private myAnswerService: MyAnswerMgmService,
        private answerService: AnswerMgmService,
        private identifyAssetService: IdentifyAssetService,
        private route: ActivatedRoute,
        private assetService: AssetMgmService,
        private idaUtilsService: IdentifyAssetUtilService
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.registerChangeIdentifyAssets();
        this.assets$ = this.assetService.findAll();
        this.questionnaries = [];
        this.myAnswers = [];
        this.questionnairesService.getAllQuestionnairesByPurpose(QuestionnairePurpose.ID_ASSETS).toPromise().then((res) => {
            if (res && res instanceof QuestionnaireMgm) {
                this.questionnaries.push(res);
            } else if (res && res instanceof Array) {
                this.questionnaries = res;
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
                    /*
                    if (this.questions && this.questions.length > 0) {
                        console.log(this.questions);
                        this.myAnswers = [];
                        this.questionsAnswerMap = new Map<number, Array<AnswerMgm>>();
                        for (const q of this.questions) {
                            for (const a of q.answers) {
                                this.answerService.find(a.id).toPromise().then((ans) => {
                                    if (ans.body) {
                                        let arr;
                                        if (this.questionsAnswerMap.get(q.id)) {
                                            arr = this.questionsAnswerMap.get(q.id) as AnswerMgm[];
                                            arr.push(ans.body);
                                        } else {
                                            arr = [];
                                            arr.push(ans.body);
                                        }
                                        this.questionsAnswerMap.set(q.id, arr);
                                    }
                                });
                            }
                            console.log(this.questionsAnswerMap);
                        }
                    }
                    */
                });
            }
        });
    }

    /*
    public myAnswersReceiver(myAnswers: MyAnswerMgm[]) {
        // console.log(myAnswer);
        if (myAnswers) {
            for (const myAnswer of myAnswers) {
                const index = _.findIndex(this.myAnswers, { id: myAnswer.id });
                if (index !== -1) {
                    this.myAnswers.splice(index, 1, myAnswer);
                } else {
                    this.myAnswers.push(myAnswer);
                }
            }
        }
    }
    */

    public sendAnswerAndSaveMyAssets() {
        this.myAnswers = this.idaUtilsService.getMyAnswersComplited();
        this.myAssets = this.idaUtilsService.getMyAssets();
        console.log(this.myAnswers);
        console.log(this.myAssets);
        // TODO funzioni per il salvataggio
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
