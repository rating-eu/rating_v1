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

import {
    ChangeDetectorRef,
    Component,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges, ViewRef
} from '@angular/core';
import {QuestionControlService} from './services/question-control.service';
import {FormGroup} from '@angular/forms';
import {QuestionMgm, QuestionMgmService} from '../../../../entities/question-mgm';
import {AnswerMgm, AnswerMgmService} from '../../../../entities/answer-mgm';
import {ThreatAgentMgm, ThreatAgentMgmService} from '../../../../entities/threat-agent-mgm';
import {Fraction} from '../../../../utils/fraction.class';
import * as CryptoJS from 'crypto-js';
import {Couple} from '../../../../utils/couple.class';
import {DataSharingService} from '../../../../data-sharing/data-sharing.service';
import {Router} from '@angular/router';
import {QuestionnaireStatusMgm, QuestionnaireStatusMgmService} from '../../../../entities/questionnaire-status-mgm';
import {Status} from '../../../../entities/enumerations/Status.enum';
import {QuestionnaireMgm} from '../../../../entities/questionnaire-mgm';
import {QuestionnairePurpose} from '../../../../entities/enumerations/QuestionnairePurpose.enum';
import {MyAnswerMgm, MyAnswerMgmService} from '../../../../entities/my-answer-mgm';
import {Account, AccountService, User, UserService} from '../../../../shared';
import {Subscription} from 'rxjs/Subscription';
import {FormUtils} from '../../../utils/FormUtils';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {Observable} from 'rxjs/Observable';
import {HttpResponse} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {PartialSubmitDialogComponent} from '../partial-submit-dialog/partial-submit-dialog.component';
import {MyCompanyMgm, MyCompanyMgmService} from '../../../../entities/my-company-mgm';
import {Role} from '../../../../entities/enumerations/Role.enum';
import {ContainerType} from '../../../../entities/enumerations/ContainerType.enum';
import {VulnerabilityAreaMgm, VulnerabilityAreaMgmService} from '../../../../entities/vulnerability-area-mgm';
import {AnswerLikelihood} from "../../../../entities/enumerations/AnswerLikelihood.enum";
import {AnswerWeightMgm, AnswerWeightMgmService} from "../../../../entities/answer-weight-mgm";
import {QuestionType} from "../../../../entities/enumerations/QuestionType.enum";
import {VulnerabilityRadarService} from "../../../../dashboard/vulnerability-radar-widget/vulnerability-radar.service";

@Component({
    selector: 'jhi-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['../../../css/radio.css', 'dynamic-form.css'],
    providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit, OnDestroy, OnChanges {

    private static YES = 'YES';
    private static NO = 'NO';

    private static CISO_ROLE: string = Role[Role.ROLE_CISO];
    private static EXTERNAL_ROLE: string = Role[Role.ROLE_EXTERNAL_AUDIT];

    public loading = false;
    public debug = false;

    public roleEnum = Role;
    public purposeEnum = QuestionnairePurpose;
    public answerLikelihoodEnum = AnswerLikelihood;


    public questionsArray: QuestionMgm[];
    public humanQuestionsArray: QuestionMgm[];
    public itQuestionsArray: QuestionMgm[];
    public physicalQuestionsArray: QuestionMgm[];
    public currentTabIndex: number;

    /**
     * Map QuestionID ==> Question
     */
    public questionsArrayMap: Map<number, QuestionMgm>;
    public form: FormGroup;
    public cisoQuestionnaireStatus: QuestionnaireStatusMgm;
    public externalQuestionnaireStatus: QuestionnaireStatusMgm;

    public cisoMyAnswers: MyAnswerMgm[];
    public externalMyAnswers: MyAnswerMgm[];

    private account: Account;
    private role: Role;
    private user: User;
    private myCompany: MyCompanyMgm;
    private subscriptions: Subscription[] = [];
    private _questionnaire: QuestionnaireMgm;

    public containerTypeEnum = ContainerType;

    private _containerType: ContainerType;
    private _areaID: number;

    public area: VulnerabilityAreaMgm;

    private answerWeights: AnswerWeightMgm[];
    public answerWeightsMap: Map<QuestionType, Map<AnswerLikelihood, AnswerWeightMgm>>;

    public questionAreasMap: Map<number/*QuestionID*/, Map<number/*areaID*/, VulnerabilityAreaMgm>>;

    // VulnerabilityRadar Data
    public vulnerabilityRadarData: Map<number/*AreaID*/, Map<ContainerType, number/*Vulnerability*/>>;

    constructor(private questionControlService: QuestionControlService,
                private dataSharingSerivce: DataSharingService,
                private router: Router,
                private myAnswerService: MyAnswerMgmService,
                private answerService: AnswerMgmService,
                private answerWeightService: AnswerWeightMgmService,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                private myCompanyService: MyCompanyMgmService,
                private accountService: AccountService,
                private userService: UserService,
                private questionService: QuestionMgmService,
                private threatAgentService: ThreatAgentMgmService,
                private vulnerabilityAreaService: VulnerabilityAreaMgmService,
                private vulnerabilityRadarService: VulnerabilityRadarService,
                private modalService: NgbModal,
                private changeDetector: ChangeDetectorRef) {
    }

    @Input()
    set questionnaire(questionnaire: QuestionnaireMgm) {
        this._questionnaire = questionnaire;
    }

    get questionnaire() {
        return this._questionnaire;
    }

    @Input()
    set containerType(containerType: ContainerType) {
        this._containerType = containerType;

        if (this._containerType) {
            switch (this._containerType) {
                case ContainerType.HUMAN: {
                    this.currentTabIndex = 0;
                    break;
                }
                case ContainerType.IT: {
                    this.currentTabIndex = 1;
                    break;
                }
                case ContainerType.PHYSICAL: {
                    this.currentTabIndex = 2;
                    break;
                }
            }
        }
    }

    get containerType(): ContainerType {
        return this._containerType;
    }

    @Input()
    set areaID(areaID: number) {
        this._areaID = areaID;

        if (this._areaID) {
            this.vulnerabilityAreaService.find(this._areaID).toPromise().then((response: HttpResponse<VulnerabilityAreaMgm>) => {
                this.area = response.body;
            });
        }
    }

    get areaID(): number {
        return this._areaID;
    }

    isValid(questionID) {
        return this.form.controls[questionID].valid;
    }

    trackByID(index, question: QuestionMgm) {
        return question.id;
    }

    /*
     Initialize the directive/component after Angular first displays
     the data-bound properties and sets the directive/component's
     input properties. Called once, after the first ngOnChanges().
     */
    ngOnInit() {
        const account$ = this.accountService.get();
        const questions$ = this.questionService.getQuestionsByQuestionnaire(this.questionnaire.id);
        const humanQuestions$ = this.questionService.getQuestionsByQuestionnaireAndSection(this.questionnaire.id, ContainerType.HUMAN);
        const itQuestions$ = this.questionService.getQuestionsByQuestionnaireAndSection(this.questionnaire.id, ContainerType.IT);
        const physicalQuestions$ = this.questionService.getQuestionsByQuestionnaireAndSection(this.questionnaire.id, ContainerType.PHYSICAL);

        const questionsAndAccount$ = forkJoin(account$, questions$, humanQuestions$, itQuestions$, physicalQuestions$);

        const user$ = questionsAndAccount$.mergeMap(
            (response: [HttpResponse<Account>, HttpResponse<QuestionMgm[]>, HttpResponse<QuestionMgm[]>, HttpResponse<QuestionMgm[]>, HttpResponse<QuestionMgm[]>]) => {
                this.account = response[0].body;

                if (this.account['authorities'].includes(DynamicFormComponent.CISO_ROLE)) {
                    this.role = Role.ROLE_CISO;
                } else if (this.account['authorities'].includes(DynamicFormComponent.EXTERNAL_ROLE)) {
                    this.role = Role.ROLE_EXTERNAL_AUDIT;
                }

                this.questionsArray = response[1].body;

                // PlaceHolders for the questions of the sections
                const _humanQuestions: QuestionMgm[] = response[2].body;
                const _itQuestions: QuestionMgm[] = response[3].body;
                const _physicalQuestions: QuestionMgm[] = response[4].body;

                this.questionsArray.sort((a: QuestionMgm, b: QuestionMgm) => {
                    return a.order - b.order;
                });

                this.questionsArrayMap = FormUtils.questionsToMap(this.questionsArray);

                // Generate the form according to the Role
                switch (this.role) {
                    case Role.ROLE_CISO: {
                        switch (this.questionnaire.purpose) {
                            case QuestionnairePurpose.ID_THREAT_AGENT: {
                                this.form = this.questionControlService.toFormGroupCISOIdentifyThreatAgents(this.questionsArray);
                                break;
                            }
                            case QuestionnairePurpose.SELFASSESSMENT: {
                                this.form = this.questionControlService.toFormGroupCISOSelfAssessment(this.questionsArray);

                                // Populate the array with the questions of the corresponding section
                                // Pay attention to use the same object reference used to build the form, otherwise
                                // the patch value will not work.

                                if (_humanQuestions && _itQuestions && _physicalQuestions) {
                                    this.humanQuestionsArray = [];
                                    this.itQuestionsArray = [];
                                    this.physicalQuestionsArray = [];

                                    _humanQuestions.forEach(question => {
                                        this.humanQuestionsArray.push(this.questionsArrayMap.get(question.id));
                                    });

                                    _itQuestions.forEach(question => {
                                        this.itQuestionsArray.push(this.questionsArrayMap.get(question.id));
                                    });

                                    _physicalQuestions.forEach(question => {
                                        this.physicalQuestionsArray.push(this.questionsArrayMap.get(question.id));
                                    });
                                }

                                break;
                            }
                        }

                        break;
                    }
                    case Role.ROLE_EXTERNAL_AUDIT: {
                        switch (this.questionnaire.purpose) {
                            case QuestionnairePurpose.SELFASSESSMENT: {
                                this.form = this.questionControlService.toFormGroupExternalAuditor(this.questionsArray);

                                // Populate the array with the questions of the corresponding section
                                // Pay attention to use the same object reference used to build the form, otherwise
                                // the patch value will not work.

                                if (_humanQuestions && _itQuestions && _physicalQuestions) {
                                    this.humanQuestionsArray = [];
                                    this.itQuestionsArray = [];
                                    this.physicalQuestionsArray = [];

                                    _humanQuestions.forEach(question => {
                                        this.humanQuestionsArray.push(this.questionsArrayMap.get(question.id));
                                    });

                                    _itQuestions.forEach(question => {
                                        this.itQuestionsArray.push(this.questionsArrayMap.get(question.id));
                                    });

                                    _physicalQuestions.forEach(question => {
                                        this.physicalQuestionsArray.push(this.questionsArrayMap.get(question.id));
                                    });
                                }

                                break;
                            }
                        }

                        break;
                    }
                    default: {
                        console.log('Warning: There is a problem... Role is different from CISO or EXTERNAL_AUDIT');
                    }
                }

                this.buildQuestionAreasMap();

                return this.userService.find(this.account.login);
            }
        );

        const myCompany$ = user$.pipe(
            switchMap((response: HttpResponse<User>) => {
                if (Array.isArray(response.body)) {
                    this.user = response.body[0];
                } else {
                    this.user = response.body;
                }

                return this.myCompanyService.findByUser(this.user.id);
            })
        );

        myCompany$.toPromise().then(
            (response: HttpResponse<MyCompanyMgm>) => {
                this.myCompany = response.body;

                this.cisoQuestionnaireStatus = this.dataSharingSerivce.cisoQuestionnaireStatus;
                this.externalQuestionnaireStatus = this.dataSharingSerivce.externalQuestionnaireStatus;

                // Path Values
                if (this.cisoQuestionnaireStatus && this.cisoQuestionnaireStatus.answers && this.cisoQuestionnaireStatus.answers.length > 0) {
                    this.cisoMyAnswers = this.cisoQuestionnaireStatus.answers;

                    // Fetch Vulnerabilities by Area
                    this.vulnerabilityRadarService.getVulnerabilityRadar(this.cisoQuestionnaireStatus.id)
                        .toPromise()
                        .then((response: HttpResponse<Map<number, Map<ContainerType, number>>>) => {
                            this.vulnerabilityRadarData = response.body;
                        });

                    // Restore the checked status of the Form inputs
                    this.form.patchValue(this.myAnswersToFormValue(this.cisoMyAnswers, this.questionsArrayMap));
                }

                if (this.questionnaire.purpose === QuestionnairePurpose.SELFASSESSMENT) {
                    if (this.externalQuestionnaireStatus &&
                        this.externalQuestionnaireStatus.answers &&
                        this.externalQuestionnaireStatus.answers.length > 0) {
                        this.externalMyAnswers = this.externalQuestionnaireStatus.answers;

                        const formValue: {} = this.myAnswersToFormValue(this.cisoMyAnswers, this.questionsArrayMap, this.externalMyAnswers);

                        // Restore the checked status of the Form inputs
                        this.form.patchValue(formValue);
                    }

                    this.resizeAnswerHeighs();
                }
            }
        );

        this.answerWeightService.query().toPromise()
            .then((response: HttpResponse<AnswerWeightMgm[]>) => {
                if (response && response.body) {
                    this.answerWeights = response.body;

                    this.buildAnswerWeightsMap();
                }
            });
    }

    ngOnDestroy() {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }

        if (this.changeDetector) {
            this.changeDetector.detach();
        }
    }

    submitDispatcher() {
        switch (this.questionnaire.purpose) {
            case QuestionnairePurpose.SELFASSESSMENT: {
                switch (this.role) {
                    case Role.ROLE_CISO: {
                        this.evaluateWeakness();
                        break;
                    }
                    case Role.ROLE_EXTERNAL_AUDIT: {
                        this.externalAuditRefinement();
                        break;
                    }
                    default: {
                        // DO-NOTHING
                    }
                }

                break;
            }
            case QuestionnairePurpose.ID_THREAT_AGENT: {
                this.identifyThreatAgents();
                break;
            }
            default: {
                // Do-Nothing
            }
        }
    }

    private identifyThreatAgents() {
        this.loading = true;

        /**
         * Map representing the submitted form data.
         *
         * The key: string is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<string, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm> = FormUtils.formToMap<AnswerMgm>(this.form);
        this.dataSharingSerivce.identifyThreatAgentsFormDataMap = formDataMap;
        /**
         * The key: string is the SHA256 of the ThreatAgent JSON
         * The value: Couple<ThreatAgentMgm, Fraction> contains the ThreatAgent itself
         * and the fraction of YES answers over all te questions identifying that ThreatAgent.
         * @type {Map<string, Couple<ThreatAgentMgm, Fraction>>}
         */
        const threatAgentsPercentageMap: Map<string, Couple<ThreatAgentMgm, Fraction>> = new Map<string, Couple<ThreatAgentMgm, Fraction>>();

        formDataMap.forEach((value, key) => {
            const answer: AnswerMgm = value as AnswerMgm;
            const question: QuestionMgm = this.questionsArrayMap.get(Number(key));
            const threatAgent: ThreatAgentMgm = question.threatAgent;
            const threatAgentHash = CryptoJS.SHA256(JSON.stringify(threatAgent)).toString();

            if (threatAgentsPercentageMap.has(threatAgentHash)) {// a question identifying this threat agent has already been encountered.
                // fraction = #YES/#Questions
                const fraction: Fraction = threatAgentsPercentageMap.get(threatAgentHash).value;
                // increment the number of questions identifying this threat-agent
                fraction.whole++;
                if (answer.name.toUpperCase() === DynamicFormComponent.YES) {
                    fraction.part++;
                } else if (answer.name.toUpperCase() === DynamicFormComponent.NO) {
                }
            } else {// first time
                const fraction = new Fraction(0, 1);
                threatAgentsPercentageMap.set(threatAgentHash, new Couple<ThreatAgentMgm, Fraction>(threatAgent, fraction));

                if (answer.name.toUpperCase() === DynamicFormComponent.YES) {
                    fraction.part++;
                } else if (answer.name.toUpperCase() === DynamicFormComponent.NO) {
                }
            }
        });

        this.dataSharingSerivce.threatAgentsMap = threatAgentsPercentageMap;

        // #1 Create the QuestionnaireStatus or Update the existing one
        let questionnaireStatus: QuestionnaireStatusMgm = null;

        if (!this.cisoQuestionnaireStatus) {
            questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.FULL, null, null,
                this.myCompany.companyProfile, this.questionnaire, this.role, this.user, [], undefined, undefined);
        } else {
            questionnaireStatus = this.cisoQuestionnaireStatus;
        }

        // #2 Create the MyAnswers
        const myAnswers: MyAnswerMgm[] = this.createMyAnswers(formDataMap);
        // #3 Set the MyAnswers
        questionnaireStatus.answers = myAnswers;

        // Calculate the Status of the Questionnaire
        const status: Status = !(questionnaireStatus.answers) || questionnaireStatus.answers.length === 0 ? Status.EMPTY
            : questionnaireStatus.answers.length === this.questionsArray.length ? Status.FULL
                : Status.PENDING;

        // Set the status of the Questionnaire
        questionnaireStatus.status = status;

        switch (questionnaireStatus.status) {
            case Status.EMPTY:
            case Status.PENDING: {
                const modalRef: NgbModalRef = this.modalService.open(PartialSubmitDialogComponent as Component);

                modalRef.result.then((value: boolean) => {
                    if (value === true) {
                        questionnaireStatus = this.continueIdentifyThreatAgents(questionnaireStatus, threatAgentsPercentageMap);
                    } else {
                        this.loading = false;
                        return;
                    }
                });

                break;
            }
            case Status.FULL: {
                questionnaireStatus = this.continueIdentifyThreatAgents(questionnaireStatus, threatAgentsPercentageMap);
                break;
            }
        }
    }

    private evaluateWeakness() {
        this.loading = true;
        // Get the Questionnaire's Answers, persist them, update the matrix accordingly
        /**
         * Map representing the submitted form data.
         *
         * The key: string is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<string, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm> = FormUtils.formToMap<AnswerMgm>(this.form);

        // #1 Create the QuestionnaireStatus or update the existing one
        let questionnaireStatus = null;

        if (!this.cisoQuestionnaireStatus) {
            questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.FULL, null, null,
                this.myCompany.companyProfile, this.questionnaire, this.role, this.user, [], undefined, undefined);
        } else {
            questionnaireStatus = this.cisoQuestionnaireStatus;
        }

        // #2 Create the MyAnswers
        const myAnswers: MyAnswerMgm[] = this.createMyAnswers(formDataMap);
        // #3 Set the MyAnswers
        questionnaireStatus.answers = myAnswers;

        // Calculate the Status of the Questionnaire
        const status: Status = !(questionnaireStatus.answers) || questionnaireStatus.answers.length === 0 ? Status.EMPTY
            : questionnaireStatus.answers.length === this.questionsArray.length ? Status.FULL
                : Status.PENDING;

        // Set the status of the Questionnaire
        questionnaireStatus.status = status;

        switch (questionnaireStatus.status) {
            case Status.EMPTY:
            case Status.PENDING: {
                const modalRef: NgbModalRef = this.modalService.open(PartialSubmitDialogComponent as Component);

                modalRef.result.then((value: boolean) => {
                    if (value === true) {
                        questionnaireStatus = this.continueEvaluateWeakness(questionnaireStatus);
                        this.loading = false;
                    } else {
                        this.loading = false;
                        return;
                    }
                });
                break;
            }
            case Status.FULL: {
                questionnaireStatus = this.continueEvaluateWeakness(questionnaireStatus);
                this.loading = false;
                break;
            }
        }
    }

    private externalAuditRefinement() {
        this.loading = true;
        // Get the Questionnaire's Answers, persist them, update the matrix accordingly
        /**
         * Map representing the submitted form data.
         *
         * The key: string is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<string, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm | string> = FormUtils.formToMap<AnswerMgm | string>(this.form);

        // #1 Create the QuestionnaireStatus or update the existing one
        let questionnaireStatus: QuestionnaireStatusMgm = null;

        if (!this.externalQuestionnaireStatus) {
            questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.FULL, null, null,
                this.myCompany.companyProfile, this.questionnaire, this.role, this.user, [], undefined, undefined);
        } else {
            questionnaireStatus = this.externalQuestionnaireStatus;
        }

        // #2 Create MyAnswers for refinement
        const myRefinementAnswers: MyAnswerMgm[] = this.createMyRefinementAnswers(formDataMap);

        // #3 Set the MyAnswers
        questionnaireStatus.answers = myRefinementAnswers;

        // Calculate the Status of the Questionnaire
        const status: Status = !(questionnaireStatus.answers) || questionnaireStatus.answers.length === 0 ? Status.EMPTY
            : questionnaireStatus.answers.length === this.questionsArray.length ? Status.FULL
                : Status.PENDING;

        // Set the status of the Questionnaire
        questionnaireStatus.status = status;

        switch (questionnaireStatus.status) {
            case Status.EMPTY:
            case Status.PENDING: {
                const modalRef: NgbModalRef = this.modalService.open(PartialSubmitDialogComponent as Component);

                modalRef.result.then((value: boolean) => {
                    if (value === true) {
                        questionnaireStatus = this.continueExternalRefinement(questionnaireStatus);
                    } else {
                        this.loading = false;
                        return;
                    }
                });
                break;
            }
            case Status.FULL: {
                questionnaireStatus = this.continueExternalRefinement(questionnaireStatus);
                break;
            }
        }


    }

    // ==========HELPER METHODS============

    sort(answers: AnswerMgm[]): AnswerMgm[] {
        return answers.sort((a, b) => {
                return a.order - b.order;
            }
        );
    }

    private myAnswersToFormValue(myCISOAnswers: MyAnswerMgm[], questionsMap: Map<number, QuestionMgm>, myEXTERNALAnswers?: MyAnswerMgm[]) {
        const value = {};

        if (myCISOAnswers) {
            myCISOAnswers.forEach(
                (myAnswer) => {
                    // Get the "exact" QUESTION used in the form generation
                    const question = questionsMap.get(myAnswer.question.id);
                    // Get the "exact" ANSWERS used as [VALUE] for the question
                    const answers: AnswerMgm[] = question.answers;
                    let exactAnswer: AnswerMgm;
                    for (const answer of answers) {
                        if (answer.id === myAnswer.answer.id) {
                            exactAnswer = answer;
                            break;
                        }
                    }

                    // The CISO's answer
                    value[String(myAnswer.question.id)] = exactAnswer;
                    value[String(myAnswer.question.id + '.ciso.note')] = myAnswer.note;
                }
            );
        }

        if (myEXTERNALAnswers) {
            myEXTERNALAnswers.forEach(
                (myAnswer) => {
                    // Get the "exact" QUESTION used in the form generation
                    const question = questionsMap.get(myAnswer.question.id);
                    // Get the "exact" ANSWERS used as [VALUE] for the question
                    const answers: AnswerMgm[] = question.answers;
                    let exactAnswer: AnswerMgm;
                    for (const answer of answers) {
                        if (answer.id === myAnswer.answer.id) {
                            exactAnswer = answer;
                            break;
                        }
                    }

                    // The EXTERNAL's answer
                    value[String(myAnswer.question.id + '.external')] = exactAnswer;
                    value[String(myAnswer.question.id + '.external.note')] = myAnswer.note;
                }
            );
        }

        return value;
    }

    private createMyAnswers(formDataMap: Map<string, AnswerMgm>): MyAnswerMgm[] {

        // CREATE the NEW MyAnswers
        // const createMyAnswersObservable: Observable<HttpResponse<MyAnswerMgm[]>> = [];
        const myAnswers: MyAnswerMgm[] = [];

        // Contains the Answers of the External Audit
        const evaluationMap: Map<number/*Question.ID*/, AnswerMgm> = new Map<number, AnswerMgm>();

        // Contains the notes of the External Audit
        const notesMap: Map<number/*Question.ID*/, string> = new Map<number, string>();

        formDataMap.forEach(
            (value: AnswerMgm | string, key: string) => {

                if (key.endsWith('.ciso.note')) {
                    const note: string = value as string;

                    if (note) {
                        const questionID: number = Number(key.replace('.ciso.note', ''));
                        notesMap.set(questionID, note);
                    }
                } else {
                    const answer: AnswerMgm = value as AnswerMgm;

                    if (answer) {// check if the the user answered this question
                        const question: QuestionMgm = this.questionsArrayMap.get(Number(key));
                        const questionnaire: QuestionnaireMgm = question.questionnaire;

                        evaluationMap.set(question.id, answer);
                    }
                }
            }
        );

        this.questionsArrayMap.forEach((question: QuestionMgm, key: number) => {
            const note: string = notesMap.get(question.id);
            const evaluationAnswer: AnswerMgm = evaluationMap.get(question.id);

            if (evaluationAnswer) {
                const myAnswer: MyAnswerMgm = new MyAnswerMgm(undefined, note, 0, evaluationAnswer, question, question.questionnaire, undefined, this.user);
                myAnswers.push(myAnswer);
            }
        });

        return myAnswers;
    }

    private createMyRefinementAnswers(formDataMap: Map<string, AnswerMgm | string>): MyAnswerMgm[] {
        // CREATE the NEW MyAnswers
        // const createMyAnswersObservable: Observable<HttpResponse<MyAnswerMgm[]>> = [];
        const myAnswers: MyAnswerMgm[] = [];

        // Contains the Answers of the External Audit
        const refinementMap: Map<number/*Question.ID*/, AnswerMgm> = new Map<number, AnswerMgm>();

        // Contains the notes of the External Audit
        const notesMap: Map<number/*Question.ID*/, string> = new Map<number, string>();

        formDataMap.forEach(// Key could be id | id.external | id.note
            (value: AnswerMgm | string, key: string) => {

                if (key.endsWith('.external')) {
                    const answer: AnswerMgm = value as AnswerMgm;

                    if (answer) {// check if the the user answered this question
                        const questionID: number = Number(key.replace('.external', ''));
                        const question: QuestionMgm = this.questionsArrayMap.get(questionID);

                        refinementMap.set(question.id, answer);
                    }
                } else if (key.endsWith('.external.note')) {
                    const note: string = value as string;

                    if (note) {// check if the the user answered this question
                        const questionID: number = Number(key.replace('.external.note', ''));
                        const question: QuestionMgm = this.questionsArrayMap.get(questionID);

                        notesMap.set(questionID, note);
                    }
                }
            }
        );

        this.questionsArrayMap.forEach((question: QuestionMgm, key: number) => {
            const note: string = notesMap.get(question.id);
            const refinedAnswer: AnswerMgm = refinementMap.get(question.id);

            if (refinedAnswer) {
                const myAnswer: MyAnswerMgm = new MyAnswerMgm(undefined, note, 0, refinedAnswer, question, question.questionnaire, undefined, this.user);
                myAnswers.push(myAnswer);
            }
        });

        return myAnswers;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.resizeAnswerHeighs();
    }

    private resizeAnswerHeighs() {
        if (this.role && this.role === Role.ROLE_EXTERNAL_AUDIT) {
            this.questionsArray.forEach((question) => {

                question.answers.forEach((answer, index) => {
                    const cisoRadioButton: HTMLElement = document.getElementById(question.id + '' + answer.id + '');
                    const externalRadioButton: HTMLElement = document.getElementById(question.id + '' + answer.id + '.external');

                    if (cisoRadioButton && externalRadioButton) {
                        const externalHeight = externalRadioButton.clientHeight;

                        cisoRadioButton.style.height = externalHeight + 'px';
                    }
                });
            });
        }
    }

    // =========CONTINUE FORM SUBMISSION=====

    private continueIdentifyThreatAgents(questionnaireStatus: QuestionnaireStatusMgm, threatAgentsPercentageMap: Map<string, Couple<ThreatAgentMgm, Fraction>>) {
        let questionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>> = null;

        if (!this.cisoQuestionnaireStatus) {
            // Create a new QStatus
            questionnaireStatus$ = this.questionnaireStatusService.create(questionnaireStatus);
        } else {
            // Update the existing QStatus
            questionnaireStatus$ = this.questionnaireStatusService.update(questionnaireStatus);
        }

        questionnaireStatus$.toPromise().then(
            (qStatusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                questionnaireStatus = qStatusResponse.body;
                this.cisoQuestionnaireStatus = questionnaireStatus;

                this.loading = false;
                this.router.navigate(['/dashboard']);
            }
        );

        return questionnaireStatus;
    }

    private continueEvaluateWeakness(questionnaireStatus: any) {
        let questionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>> = null;

        if (!this.cisoQuestionnaireStatus) {
            // Create a new QStatus
            questionnaireStatus$ = this.questionnaireStatusService.create(questionnaireStatus);
        } else {
            // Update the existing QStatus
            questionnaireStatus$ = this.questionnaireStatusService.update(questionnaireStatus);
        }

        questionnaireStatus$.toPromise().then(
            (qStatusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                questionnaireStatus = qStatusResponse.body;
                this.cisoQuestionnaireStatus = questionnaireStatus;
                this.loading = false;
                this.router.navigate(['/evaluate-weakness/questionnaires/SELFASSESSMENT']);
                return questionnaireStatus;
            }
        ).catch(() => {
            // TODO Error management
            this.loading = false;
        });
    }

    private continueExternalRefinement(questionnaireStatus: QuestionnaireStatusMgm) {
        let cisoQuestionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>> = null;
        let externalQuestionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>> = null;

        if (this.cisoQuestionnaireStatus) {
            // Set the Refinement QuestionnaireStatus
            this.cisoQuestionnaireStatus.refinement = questionnaireStatus;

            // Update the CISO QStatus
            cisoQuestionnaireStatus$ = this.questionnaireStatusService.update(this.cisoQuestionnaireStatus);

            // #4 Persist the CISO QuestionnaireStatus
            this.subscriptions.push(cisoQuestionnaireStatus$.subscribe(
                (response: HttpResponse<QuestionnaireStatusMgm>) => {
                    this.cisoQuestionnaireStatus = response.body;

                    this.loading = false;
                    this.router.navigate(['/evaluate-weakness/questionnaires/SELFASSESSMENT']);
                }
            ));

            return this.externalQuestionnaireStatus;
        } else {

        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log("OnCHanges...");

        this.buildQuestionAreasMap();
    }

    private buildQuestionAreasMap() {
        if (this.questionsArray && this.questionsArray.length && this._containerType && this._areaID) {
            this.questionAreasMap = new Map();

            this.questionsArray.forEach((question: QuestionMgm) => {
                const areas: VulnerabilityAreaMgm[] = question.areas;

                const areasMap: Map<number/*AreaID*/, VulnerabilityAreaMgm> = new Map();

                if (areas && areas.length) {
                    areas.forEach((area: VulnerabilityAreaMgm) => {
                        areasMap.set(area.id, area);
                    });
                }

                this.questionAreasMap.set(question.id, areasMap);
            });

            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                this.changeDetector.detectChanges();
            }
        }
    }

    private buildAnswerWeightsMap() {
        if (this.answerWeights && this.answerWeights.length) {
            this.answerWeightsMap = new Map();

            this.answerWeights.forEach((answerWeight: AnswerWeightMgm) => {
                const questionType: QuestionType = answerWeight.questionType;
                const answerLikelihood: AnswerLikelihood = answerWeight.likelihood;

                let innerMap: Map<AnswerLikelihood, AnswerWeightMgm> = this.answerWeightsMap.get(questionType);

                if (!innerMap) {
                    innerMap = new Map();
                    this.answerWeightsMap.set(questionType, innerMap);
                }

                innerMap.set(answerLikelihood, answerWeight);
            });
        }
    }

    /*private filterQuestionsByArea() {
        console.log("Filtering Questions by Area...");

        if (this.questionAreasMap) {
            if (this.humanQuestionsArray) {
                this.humanQuestionsArray = this.humanQuestionsArray.filter((question: QuestionMgm) => {
                    return this.questionAreasMap.get(question.id).has(this._areaID);
                });
            }

            if (this.itQuestionsArray) {
                this.itQuestionsArray = this.itQuestionsArray.filter((question: QuestionMgm) => {
                    return this.questionAreasMap.get(question.id).has(this._areaID);
                });
            }

            if (this.physicalQuestionsArray) {
                this.physicalQuestionsArray = this.physicalQuestionsArray.filter((question: QuestionMgm) => {
                    return this.questionAreasMap.get(question.id).has(this._areaID);
                });
            }

            if (this.changeDetector) {
                this.changeDetector.detach();
            }
        }
    }*/
}
