import {Component, Input, OnDestroy, OnInit, Self} from '@angular/core';
import {QuestionControlService} from './services/question-control.service';
import {AbstractControl, FormGroup} from '@angular/forms';
import {QuestionMgm, QuestionMgmService} from '../../../../entities/question-mgm';
import {AnswerMgm, AnswerMgmService} from '../../../../entities/answer-mgm';
import {ThreatAgentMgm, ThreatAgentMgmService} from '../../../../entities/threat-agent-mgm';
import {Fraction} from '../../../../utils/fraction.class';
import * as CryptoJS from 'crypto-js';
import {Couple} from '../../../../utils/couple.class';
import {DatasharingService} from '../../../../datasharing/datasharing.service';
import {Router} from '@angular/router';
import {
    QuestionnaireStatusMgm, QuestionnaireStatusMgmService, Role
} from '../../../../entities/questionnaire-status-mgm';
import {Status} from '../../../../entities/enumerations/QuestionnaireStatus.enum';
import {QuestionnaireMgm} from '../../../../entities/questionnaire-mgm';
import {QuestionnairePurpose} from '../../../../entities/enumerations/QuestionnairePurpose.enum';
import {MyAnswerMgm, MyAnswerMgmService} from '../../../../entities/my-answer-mgm';
import {AccountService, Principal, User, UserService} from '../../../../shared';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../../../entities/self-assessment-mgm';
import {Subscription} from 'rxjs/Subscription';
import {FormUtils} from '../../../utils/FormUtils';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {Observable} from 'rxjs/Observable';
import {HttpResponse} from '@angular/common/http';
import {concatMap, mergeMap} from 'rxjs/operators';
import {QuestionnaireStatusMgmCustomService} from '../../../../entities/questionnaire-status-mgm/questionnaire-status-mgm.custom.service';

@Component({
    selector: 'jhi-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['../../../css/radio.css', 'dynamic-form.css'],
    providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit, OnDestroy {

    private static YES = 'YES';
    private static NO = 'NO';

    private static CISO_ROLE = Role[Role.ROLE_CISO];
    private static EXTERNAL_ROLE = Role[Role.ROLE_EXTERNAL_AUDIT];

    public loading = false;
    public debug = false;
    public cisoEditMode: boolean;
    public externalAuditEditMode: boolean;

    roleEnum = Role;
    purposeEnum = QuestionnairePurpose;

    questionsArray: QuestionMgm[];
    /**
     * Map QuestionID ==> Question
     */
    questionsArrayMap: Map<number, QuestionMgm>;
    form: FormGroup;
    cisoQuestionnaireStatus: QuestionnaireStatusMgm;
    externalQuestionnaireStatus: QuestionnaireStatusMgm;

    cisoMyAnswers: MyAnswerMgm[];
    externalMyAnswers: MyAnswerMgm[];

    private account: Account;
    private role: Role;
    private user: User;
    private selfAssessment: SelfAssessmentMgm;
    private subscriptions: Subscription[] = [];
    private _questionnaire: QuestionnaireMgm;

    constructor(private questionControlService: QuestionControlService,
                private dataSharingSerivce: DatasharingService,
                private router: Router,
                private myAnswerService: MyAnswerMgmService,
                private answerService: AnswerMgmService,
                private selfAssessmentService: SelfAssessmentMgmService,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                private questionnaireStatusCustomService: QuestionnaireStatusMgmCustomService,
                private accountService: AccountService,
                private userService: UserService,
                private questionService: QuestionMgmService,
                private threatAgentService: ThreatAgentMgmService) {
    }

    @Input()
    set questionnaire(questionnaire: QuestionnaireMgm) {
        this._questionnaire = questionnaire;
    }

    get questionnaire() {
        return this._questionnaire;
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
        this.cisoEditMode = true;
        this.externalAuditEditMode = false;

        this.selfAssessment = this.selfAssessmentService.getSelfAssessment();

        // 1) Here all the input properties are expected to be set!!!
        // 2) Get the logged user and its ROLE.
        // 3) Get the QuestionnairePurpose.
        // 4) Create the form based on points 2 & 3.

        const account$ = this.accountService.get();
        const questions$ = this.questionService.getQuestionsByQuestionnaire(this.questionnaire.id);
        const questionsAndAccount$ = forkJoin(account$, questions$);

        const user$ = questionsAndAccount$.mergeMap(
            (response: [HttpResponse<Account>, HttpResponse<QuestionMgm[]>]) => {
                this.account = response[0].body;
                if (this.account['authorities'].includes(DynamicFormComponent.CISO_ROLE)) {
                    this.role = Role.ROLE_CISO;
                } else if (this.account['authorities'].includes(DynamicFormComponent.EXTERNAL_ROLE)) {
                    this.role = Role.ROLE_EXTERNAL_AUDIT;
                }

                this.questionsArray = response[1].body;
                this.questionsArray.sort((a: QuestionMgm, b: QuestionMgm) => {
                    return a.order - b.order;
                });

                this.questionsArrayMap = FormUtils.questionsToMap(this.questionsArray);

                // Generate the form according to the Role
                switch (this.role) {
                    case Role.ROLE_CISO: {
                        this.form = this.questionControlService.toFormGroupCISO(this.questionsArray);
                        break;
                    }
                    case Role.ROLE_EXTERNAL_AUDIT: {
                        this.form = this.questionControlService.toFormGroupExternalAuditor(this.questionsArray);
                        break;
                    }
                    default: {
                        console.log('Warning: There is a problem... Role is different from CISO or EXTERNAL_AUDIT');
                    }
                }

                return this.userService.find(this.account['login']);
            }
        );

        const cisoQuestionnaireStatus$ = user$.mergeMap(
            (response: HttpResponse<User>) => {
                this.user = response.body;

                // Fetch the QuestionnaireStatus of the CISO
                return this.questionnaireStatusCustomService
                    .getByRoleSelfAssessmentAndQuestionnaire(DynamicFormComponent.CISO_ROLE, this.selfAssessment.id, this.questionnaire.id);
            }
        );

        cisoQuestionnaireStatus$.subscribe(
            (response: HttpResponse<QuestionnaireStatusMgm>) => {
                this.cisoQuestionnaireStatus = response.body;

                if (this.cisoQuestionnaireStatus && this.cisoQuestionnaireStatus.answers) {
                    this.cisoMyAnswers = this.cisoQuestionnaireStatus.answers;

                    // Restore the checked status of the Form inputs
                    this.form.patchValue(this.myAnswersToFormValue(this.cisoMyAnswers, this.questionsArrayMap));
                } else {
                    // Enable the edit mode only if there is no QuestionnaireStatus in DB
                    // this.cisoEditMode = true;
                }
            }
        );

        const externalQuestionnaireStatus$ = user$.mergeMap(
            (response: HttpResponse<User>) => {
                this.user = response.body;
                // Fetch the QuestionnaireStatus of the CISO
                return this.questionnaireStatusCustomService
                    .getByRoleSelfAssessmentAndQuestionnaire(DynamicFormComponent.EXTERNAL_ROLE, this.selfAssessment.id, this.questionnaire.id);
            }
        );

        externalQuestionnaireStatus$.subscribe(
            (response: HttpResponse<QuestionnaireStatusMgm>) => {
                this.externalQuestionnaireStatus = response.body;

                if (this.externalQuestionnaireStatus && this.externalQuestionnaireStatus.answers) {
                    this.externalMyAnswers = this.externalQuestionnaireStatus.answers;

                    // Restore the checked status of the Form inputs
                    this.form.patchValue(this.myAnswersToFormValue(this.externalMyAnswers, this.questionsArrayMap, false));
                } else {
                    // Enable the edit mode only if there is no QuestionnaireStatus in DB
                    this.externalAuditEditMode = true;
                }
            }
        );
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
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
                this.selfAssessment, this.questionnaire, this.role, this.user, []);
        } else {
            questionnaireStatus = this.cisoQuestionnaireStatus;
        }

        // #2 Create the MyAnswers
        const myAnswers: MyAnswerMgm[] = this.createMyAnswers(formDataMap);
        // #3 Set the MyAnswers
        questionnaireStatus.answers = myAnswers;

        let questionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>> = null;

        if (!this.cisoQuestionnaireStatus) {
            // Create a new QStatus
            questionnaireStatus$ = this.questionnaireStatusService.create(questionnaireStatus);
        } else {
            // Update the existing QStatus
            questionnaireStatus$ = this.questionnaireStatusService.update(questionnaireStatus);
        }

        questionnaireStatus$.toPromise().then(
            (statusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                // update the questionnaire status with the ID from the DB
                questionnaireStatus = statusResponse.body;
            }
        );

        // #4 Get the default ThreatAgents
        const defaultThreatAgents$: Observable<HttpResponse<ThreatAgentMgm[]>> = this.threatAgentService.getDefaultThreatAgents();

        const selfAssessment$: Observable<HttpResponse<SelfAssessmentMgm>> = defaultThreatAgents$
            .mergeMap((response: HttpResponse<ThreatAgentMgm[]>) => {
                const defaultThreatAgents: ThreatAgentMgm[] = response.body;

                const myAnswersResponses = myAnswers;

                const identifiedThreatAgents: ThreatAgentMgm[] = [];
                const threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[] = Array.from(threatAgentsPercentageMap.values());

                threatAgentsPercentageArray.forEach((couple: Couple<ThreatAgentMgm, Fraction>) => {
                    const threatAgent: ThreatAgentMgm = couple.key;
                    const likelihood: Fraction = couple.value;
                    if (likelihood.toPercentage() > 0) {
                        identifiedThreatAgents.push(threatAgent);
                    }
                });

                const uniqueThreatAgentsSet: Set<ThreatAgentMgm> = new Set<ThreatAgentMgm>(
                    defaultThreatAgents.concat(identifiedThreatAgents));
                const uniqueThreatAgentsArray: ThreatAgentMgm[] = Array.from(uniqueThreatAgentsSet);
                this.selfAssessment.threatagents = uniqueThreatAgentsArray;

                return this.selfAssessmentService.update(this.selfAssessment);
            });

        selfAssessment$.toPromise().then(
            (selfAssessmentResponse: HttpResponse<SelfAssessmentMgm>) => {
                this.selfAssessment = selfAssessmentResponse.body;
                this.selfAssessmentService.setSelfAssessment(this.selfAssessment);
                this.loading = false;
                this.router.navigate(['/dashboard']);
            }
        ).catch(() => {
            // TODO Error management
            this.loading = false;
        });
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

        // #1 Create the QuestionnaireStatus
        let questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.FULL, null, null, this.selfAssessment, this.questionnaire, this.role, this.user, []);

        // #2 Create the MyAnswers
        const myAnswers: MyAnswerMgm[] = this.createMyAnswers(formDataMap);

        // #3 Set the MyAnswers
        questionnaireStatus.answers = myAnswers;

        const questionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>> = this.questionnaireStatusService.create(questionnaireStatus);

        // #4 Persist the QuestionnaireStatus
        const selfAssessment$: Observable<HttpResponse<SelfAssessmentMgm>> =
            this.questionnaireStatusService.create(questionnaireStatus)
                .mergeMap(
                    (statusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                        questionnaireStatus = statusResponse.body;

                        this.selfAssessment.user = this.user;
                        return this.selfAssessmentService.update(this.selfAssessment);
                    });

        selfAssessment$.toPromise()
            .then((selfAssessmentResponse: HttpResponse<SelfAssessmentMgm>) => {
                this.selfAssessment = selfAssessmentResponse.body;
                this.selfAssessmentService.setSelfAssessment(this.selfAssessment);

                this.loading = false;
                this.router.navigate(['/dashboard']);
            }).catch(() => {
            // TODO Error management
            this.loading = false;
        });

        // For now don't store the attackStrategies but recalculate them and their likelihood based on the stored
        // MyAnswers
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
        // #1 Create the status of the questionnaire
        let questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.FULL, null, null, this.selfAssessment, this.questionnaire, this.role, this.user, []);

        // #2 Create MyAnswers for refinement
        const myRefinementAnswers: MyAnswerMgm[] = this.createMyRefinementAnswers(formDataMap);

        // #3 Set the MyAnswers
        questionnaireStatus.answers = myRefinementAnswers;

        // #4 Persist the QuestionnaireStatus
        this.questionnaireStatusService.create(questionnaireStatus).toPromise()
            .then((response: HttpResponse<QuestionnaireStatusMgm>) => {
                questionnaireStatus = response.body;

                this.selfAssessmentService.setSelfAssessment(this.selfAssessment);

                this.loading = false;
                this.router.navigate(['/dashboard']);
            });
    }

    freezeQuestionnaireStatus() {
        /**
         * Map representing the submitted form data.
         *
         * The key: string is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<string, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm> = FormUtils.formToMap<AnswerMgm>(this.form);
        switch (this.cisoQuestionnaireStatus.status) {
            case Status.EMPTY: {// create a new QuestionnaireStatus && create MyAnswers
                /**
                 * The PENDING status for the questionnaire.
                 * @type {QuestionnaireStatusMgm}
                 */
                this.cisoQuestionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.PENDING, null,
                    null, this.selfAssessment, this._questionnaire, this.role, this.user, []);

                // Getting the id of the above QuestionnaireStatus
                this.subscriptions.push(
                    this.questionnaireStatusService.create(this.cisoQuestionnaireStatus).subscribe(
                        (statusResponse) => {
                            this.cisoQuestionnaireStatus = statusResponse.body;

                            // CREATE the NEW MyAnswers
                            const createObservables: Observable<HttpResponse<MyAnswerMgm[]>> = this.createMyAnswersObservable(formDataMap, this.cisoQuestionnaireStatus);

                            createObservables.subscribe(
                                (myAnswersResponse: HttpResponse<MyAnswerMgm[]>) => {
                                    const myAnswers: MyAnswerMgm[] = myAnswersResponse.body;
                                }
                            );
                        },
                        (error: any) => {
                            console.log(error);
                        },
                        () => {
                            this.router.navigate(['identify-threat-agent/questionnaires']);
                        })
                );

                break;
            }
            case Status.PENDING: {// no need to update the existing QuestionnaireStatus, just delete old MyAnswers, create new MyAnswers

                // DELETE the OLD MyAnswers
                const deleteObservables: Observable<HttpResponse<MyAnswerMgm>>[] = this.deleteMyAnswersObservable(this.cisoMyAnswers);

                forkJoin(deleteObservables).subscribe(
                    (responses: HttpResponse<any>[]) => {
                        console.log('Old my answers deleted: ' + JSON.stringify(responses));
                    },
                    (error) => {

                    },
                    () => {
                        console.log('Delete Observables completed...');
                    }
                );

                // CREATE the NEW MyAnswers
                const createObservables: Observable<HttpResponse<MyAnswerMgm[]>> = this.createMyAnswersObservable(formDataMap, this.cisoQuestionnaireStatus);

                createObservables.subscribe(
                    (myAnswersResponse: HttpResponse<MyAnswerMgm[]>) => {
                        console.log('New MyAnswers created: ');
                        const myAnswers: MyAnswerMgm[] = myAnswersResponse.body;
                    }
                );

                break;
            }
            case Status.FULL: {
                /*
                 DO-NOTHING: at the moment the EDITING of an already submitted form cannot be handled
                 cause this would need to edit also the previously identified threat agents
                 */
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

    private myAnswersToFormValue(myAnswers: MyAnswerMgm[], questionsMap: Map<number, QuestionMgm>, ciso = true) {
        const value = {};

        myAnswers.forEach(
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
                if (ciso) {
                    value[String(myAnswer.question.id)] = exactAnswer;
                } else {
                    value[String(myAnswer.question.id + '.external')] = exactAnswer;
                    value[String(myAnswer.question.id + '.note')] = myAnswer.note;
                }
            }
        );
        return value;
    }

    private createMyAnswersObservable(formDataMap: Map<string, AnswerMgm>, questionnaireStatus: QuestionnaireStatusMgm):

        Observable<HttpResponse<MyAnswerMgm[]>> {

        // CREATE the NEW MyAnswers
        // const createMyAnswersObservable: Observable<HttpResponse<MyAnswerMgm[]>> = [];
        const myAnswers:
            MyAnswerMgm[] = [];

        formDataMap.forEach(
            (value: AnswerMgm, key: string) => {
                const answer: AnswerMgm = value;
                if (answer) {// check if the the user answered this question
                    const question: QuestionMgm = this.questionsArrayMap.get(Number(key));
                    const questionnaire: QuestionnaireMgm = question.questionnaire;
                    const myAnser: MyAnswerMgm = new MyAnswerMgm(undefined, 'Checked', 0, answer, question, questionnaire, questionnaireStatus, this.user);
                    myAnswers.push(myAnser);
                }
            }
        );

        return this.myAnswerService.createAll(this.selfAssessment.id, myAnswers);
    }

    private createMyAnswers(formDataMap: Map<string, AnswerMgm>): MyAnswerMgm[] {

        // CREATE the NEW MyAnswers
        // const createMyAnswersObservable: Observable<HttpResponse<MyAnswerMgm[]>> = [];
        const myAnswers: MyAnswerMgm[] = [];

        formDataMap.forEach(
            (value: AnswerMgm, key: string) => {
                const answer: AnswerMgm = value;
                if (answer) {// check if the the user answered this question
                    const question: QuestionMgm = this.questionsArrayMap.get(Number(key));
                    const questionnaire: QuestionnaireMgm = question.questionnaire;
                    const myAnser: MyAnswerMgm = new MyAnswerMgm(undefined, 'Checked', 0, answer, question, questionnaire, undefined, this.user);
                    myAnswers.push(myAnser);
                }
            }
        );

        return myAnswers;
    }

    private deleteMyAnswersObservable(myAnswers: MyAnswerMgm[]):

        Observable<HttpResponse<MyAnswerMgm>>[] {// DELETE the OLD MyAnswers
        const deleteMyAnswerObservable: Observable<HttpResponse<MyAnswerMgm>>[] = [];

        myAnswers.forEach(
            (myAnswer) => {
                deleteMyAnswerObservable.push(
                    this.myAnswerService.delete(myAnswer.id)
                );
            }
        );

        return deleteMyAnswerObservable;
    }

    private createMyRefinementAnswersObservable(formDataMap: Map<string, AnswerMgm | string>, questionnaireStatus: QuestionnaireStatusMgm) {
        // CREATE the NEW MyAnswers
        // const createMyAnswersObservable: Observable<HttpResponse<MyAnswerMgm[]>> = [];
        const myAnswers: MyAnswerMgm[] = [];

        // Contains the Answers of the External Audit
        const refinementMap: Map<number/*Question.ID*/, AnswerMgm> = new Map<number, AnswerMgm>();

        // Contains the notes of the External Audit
        const notesMap: Map<number/*Qestion.ID*/, string> = new Map<number, string>();

        formDataMap.forEach(// Key could be id | id.external | id.note
            (value: AnswerMgm | string, key: string) => {

                if (key.endsWith('.external')) {
                    const answer: AnswerMgm = value as AnswerMgm;
                    const questionID: number = Number(key.replace('.external', ''));
                    const question: QuestionMgm = this.questionsArrayMap.get(questionID);

                    refinementMap.set(question.id, answer);
                } else if (key.endsWith('.note')) {
                    const note: string = value as string;
                    const questionID: number = Number(key.replace('.note', ''));
                    const question: QuestionMgm = this.questionsArrayMap.get(questionID);

                    notesMap.set(questionID, note);
                }
            }
        );

        this.questionsArrayMap.forEach((question: QuestionMgm, key: number) => {
            const note: string = notesMap.get(question.id);
            const refinedAnswer: AnswerMgm = refinementMap.get(question.id);

            const myAnswer: MyAnswerMgm = new MyAnswerMgm(undefined, note, 0, refinedAnswer, question, question.questionnaire, questionnaireStatus, this.user);
            myAnswers.push(myAnswer);
        });

        return this.myAnswerService.createAll(this.selfAssessment.id, myAnswers);
    }

    private createMyRefinementAnswers(formDataMap: Map<string, AnswerMgm | string>): MyAnswerMgm[] {
        // CREATE the NEW MyAnswers
        // const createMyAnswersObservable: Observable<HttpResponse<MyAnswerMgm[]>> = [];
        const myAnswers: MyAnswerMgm[] = [];

        // Contains the Answers of the External Audit
        const refinementMap: Map<number/*Question.ID*/, AnswerMgm> = new Map<number, AnswerMgm>();

        // Contains the notes of the External Audit
        const notesMap: Map<number/*Qestion.ID*/, string> = new Map<number, string>();

        formDataMap.forEach(// Key could be id | id.external | id.note
            (value: AnswerMgm | string, key: string) => {

                if (key.endsWith('.external')) {
                    const answer: AnswerMgm = value as AnswerMgm;
                    const questionID: number = Number(key.replace('.external', ''));
                    const question: QuestionMgm = this.questionsArrayMap.get(questionID);

                    refinementMap.set(question.id, answer);
                } else if (key.endsWith('.note')) {
                    const note: string = value as string;
                    const questionID: number = Number(key.replace('.note', ''));
                    const question: QuestionMgm = this.questionsArrayMap.get(questionID);

                    notesMap.set(questionID, note);
                }
            }
        );

        this.questionsArrayMap.forEach((question: QuestionMgm, key: number) => {
            const note: string = notesMap.get(question.id);
            const refinedAnswer: AnswerMgm = refinementMap.get(question.id);

            const myAnswer: MyAnswerMgm = new MyAnswerMgm(undefined, note, 0, refinedAnswer, question, question.questionnaire, undefined, this.user);
            myAnswers.push(myAnswer);
        });

        return myAnswers;
    }
}
