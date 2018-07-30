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
    answers: AnswerMgm[];

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
        private assetService: AssetMgmService) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.registerChangeIdentifyAssets();
        this.assets$ = this.assetService.findAll();
        this.questionnaries = [];
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
                    if (this.questions && this.questions.length > 0) {
                        console.log(this.questions);
                        this.myAnswers = [];
                        // TODO check for this request
                        this.answerService
                            .query({ filter: 'myanswer-is-null' })
                            .subscribe((resA: HttpResponse<AnswerMgm[]>) => {
                                let newMyAnswer: MyAnswerMgm = new MyAnswerMgm();
                                const answs: AnswerMgm[] = resA.body;
                                for (const as of answs) {
                                    newMyAnswer = this.myAnswers.find((answ) => answ.answer.id === as.id);
                                }
                                if (!newMyAnswer || !newMyAnswer.answer || !newMyAnswer.answer.id) {
                                    this.answers = resA.body;
                                    this.myAnswers = resA.body;
                                } else {
                                    this.answerService
                                        .find(newMyAnswer.answer.id)
                                        .subscribe((subRes: HttpResponse<AnswerMgm>) => {
                                            this.answers = [subRes.body].concat(resA.body);
                                            this.myAnswers = this.myAnswers.concat(this.answers);
                                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                                }
                                console.log(this.mySelf);
                                console.log(this.questionnaries);
                                console.log(this.questions);
                                console.log(this.answers);
                                console.log(this.myAnswers);
                            }, (resA: HttpErrorResponse) => this.onError(resA.message));
                    }
                });
            }
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
