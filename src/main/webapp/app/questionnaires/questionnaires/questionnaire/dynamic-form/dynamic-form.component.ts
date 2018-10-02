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
import {not} from 'rxjs/util/not';

@Component({
    selector: 'jhi-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['../../../css/radio.css'],
    providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit, OnDestroy {

    private static YES = 'YES';
    private static NO = 'NO';
    private statusEnum = Status;

    private static CISO_ROLE = Role[Role.ROLE_CISO];
    private static EXTERNAL_ROLE = Role[Role.ROLE_EXTERNAL_AUDIT];

    debug = false;
    roleEnum = Role;
    purposeEnum = QuestionnairePurpose;

    questionsArray: QuestionMgm[];
    /**
     * Map QuestionID ==> Question
     */
    questionsArrayMap: Map<number, QuestionMgm>;
    form: FormGroup;
    questionnaireStatus: QuestionnaireStatusMgm;

    myAnswers: MyAnswerMgm[];

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
        console.log('Questionnaire coming from @INPUT: ' + JSON.stringify(questionnaire));
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
                console.log('Account: ' + JSON.stringify(this.account));

                if (this.account['authorities'].includes(DynamicFormComponent.CISO_ROLE)) {
                    this.role = Role.ROLE_CISO;
                } else if (this.account['authorities'].includes(DynamicFormComponent.EXTERNAL_ROLE)) {
                    this.role = Role.ROLE_EXTERNAL_AUDIT;
                }

                this.questionsArray = response[1].body;
                this.questionsArrayMap = FormUtils.questionsToMap(this.questionsArray);

                // Generate the form according to the Role
                switch (this.role) {
                    case Role.ROLE_CISO: {
                        this.form = this.questionControlService.toFormGroupCISO(this.questionsArray);
                        console.log('Form has been created...');
                        console.log('Form is: ' + this.form);
                        break;
                    }
                    case Role.ROLE_EXTERNAL_AUDIT: {
                        this.form = this.questionControlService.toFormGroupExternalAuditor(this.questionsArray);
                        console.log('Form has been created...');
                        console.log('Form is: ' + this.form);
                        break;
                    }
                    default: {
                        console.log('Warning: There is a problem... Role is different from CISO or EXTERNAL_AUDIT');
                    }
                }

                return this.userService.find(this.account['login']);

                // Real time matrix update (DONT REMOVE THIS)
                /*if (this.questionnaire.purpose === QuestionnairePurpose.SELFASSESSMENT) {
                    for (const key in this.form.controls) {
                        const formControl = this.form.get(key);

                        if (formControl) {
                            formControl.valueChanges.subscribe(
                                (answer: AnswerMgm) => {
                                    console.log('Question ' + key + ' Field changes:');

                                    const question = this.questionsArrayMap.get(Number(key));
                                    console.log('Question:');
                                    console.log(JSON.stringify(question));

                                    console.log('Answer:');
                                    console.log(JSON.stringify(answer));

                                    this.dataSharingSerivce.answerSelfAssessment(question, answer);
                                }
                            );
                        }
                    }
                }*/
            }
        );

        const questionnaireStatus$ = user$.mergeMap(
            (response: HttpResponse<User>) => {
                this.user = response.body;
                console.log('User: ' + JSON.stringify(this.user));

                // Fetch the QuestionnaireStatus of the CISO
                const questionnaireStatus$ = this.questionnaireStatusCustomService
                    .getByRoleSelfAssessmentAndQuestionnaire(DynamicFormComponent.CISO_ROLE, this.selfAssessment.id, this.questionnaire.id);

                return questionnaireStatus$;
            }
        );

        questionnaireStatus$.subscribe(
            (response: HttpResponse<QuestionnaireStatusMgm>) => {
                this.questionnaireStatus = response.body;

                if (this.questionnaireStatus) {
                    this.myAnswerService.getAllByQuestionnaireStatusID(this.questionnaireStatus.id)
                        .toPromise().then(
                        (response: HttpResponse<MyAnswerMgm[]>) => {
                            this.myAnswers = response.body;

                            // Restore the checked status of the Form inputs
                            this.form.patchValue(this.myAnswersToFormValue(this.myAnswers, this.questionsArrayMap));
                        }
                    );
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
        console.log('SubmitDispatcher...');

        switch (this.questionnaire.purpose) {
            case QuestionnairePurpose.SELFASSESSMENT: {
                console.log('Case: ' + QuestionnairePurpose.SELFASSESSMENT);

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
                        //DO-NOTHING
                    }
                }

                break;
            }
            case QuestionnairePurpose.ID_THREAT_AGENT: {
                console.log('Case: ' + QuestionnairePurpose.ID_THREAT_AGENT);
                this.identifyThreatAgents();
                break;
            }
            default: {
                // Do-Nothing
                console.log('This shouldn\'t happen...');
            }
        }
    }

    private identifyThreatAgents() {
        console.log('ENTER ==> Identify Threat-agents...');

        console.log('OnSubmit called');
        console.log('Form\'s value is:');
        console.log(JSON.stringify(this.form.value));

        /**
         * Map representing the submitted form data.
         *
         * The key: string is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<string, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm> = FormUtils.formToMap<AnswerMgm>(this.form);
        console.log('FormDataMap size: ' + formDataMap.size);

        this.dataSharingSerivce.identifyThreatAgentsFormDataMap = formDataMap;
        console.log('FormDataMap in shared...');
        console.log('Shared FormDataMap size: ' + this.dataSharingSerivce.identifyThreatAgentsFormDataMap.size);

        /**
         * The key: string is the SHA256 of the ThreatAgent JSON
         * The value: Couple<ThreatAgentMgm, Fraction> contains the ThreatAgent itself
         * and the fraction of YES answers over all te questions identifying that ThreatAgent.
         * @type {Map<string, Couple<ThreatAgentMgm, Fraction>>}
         */
        const threatAgentsPercentageMap: Map<string, Couple<ThreatAgentMgm, Fraction>> = new Map<string, Couple<ThreatAgentMgm, Fraction>>();

        formDataMap.forEach((value, key) => {
            console.log('key: ' + key);
            console.log('value: ' + JSON.stringify(value));

            const answer: AnswerMgm = value as AnswerMgm;

            const question: QuestionMgm = this.questionsArrayMap.get(Number(key));
            console.log('Question: ' + JSON.stringify(question));

            const threatAgent: ThreatAgentMgm = question.threatAgent;
            console.log('ThreatAgent: ' + JSON.stringify(threatAgent));

            const threatAgentHash = CryptoJS.SHA256(JSON.stringify(threatAgent)).toString();

            if (threatAgentsPercentageMap.has(threatAgentHash)) {// a question identifying this threat agent has already been encountered.
                console.log('Threat agent already processed...');

                // fraction = #YES/#Questions
                const fraction: Fraction = threatAgentsPercentageMap.get(threatAgentHash).value;
                // increment the number of questions identifying this threat-agent
                fraction.whole++;

                if (answer.name.toUpperCase() === DynamicFormComponent.YES) {
                    console.log('Warning: you answered YES');
                    fraction.part++;
                } else if (answer.name.toUpperCase() === DynamicFormComponent.NO) {
                    console.log('Good, you answered NO');
                }
            } else {// first time
                console.log('First Time processing this threat agent');

                const fraction = new Fraction(0, 1);
                threatAgentsPercentageMap.set(threatAgentHash, new Couple<ThreatAgentMgm, Fraction>(threatAgent, fraction));

                if (answer.name.toUpperCase() === DynamicFormComponent.YES) {
                    console.log('Warning: you answered YES');
                    fraction.part++;
                } else if (answer.name.toUpperCase() === DynamicFormComponent.NO) {
                    console.log('Good, you answered NO');
                }
            }
        });

        console.log('Threat agents percentage map size: ' + threatAgentsPercentageMap.size);
        console.log(('BEGIN looping threat agents percentage map...'));

        threatAgentsPercentageMap.forEach((value, key) => {
            console.log('ThreatAgent:' + key + ' ==> ' + value.key.name + '\t' + value.value.toPercentage() + '\%');
        });

        console.log(('END looping threat agents percentage map...'));

        this.dataSharingSerivce.threatAgentsMap = threatAgentsPercentageMap;
        console.log('DYNAMIC FORM Shared ThreatAgent Percentage Map size: ', +this.dataSharingSerivce.threatAgentsMap.size);

        // #1 Persist QuestionnaireStatus
        let questionnaireStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined, Status.FULL, null, null, this.selfAssessment, this.questionnaire, this.role, this.user, []);
        const questionnaireStatus$: Observable<HttpResponse<QuestionnaireStatusMgm>> = this.questionnaireStatusService.create(questionnaireStatus);

        // #2 Persist MyAnswers
        const myAnswers$: Observable<HttpResponse<MyAnswerMgm[]>> = questionnaireStatus$.pipe(
            concatMap((statusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                // update the questionnaire status with the ID from the DB
                questionnaireStatus = statusResponse.body;

                return this.createMyAnswersObservable(formDataMap, questionnaireStatus);
            })
        );

        // #3 Get the default ThreatAgents
        const defaultThreatAgents$: Observable<HttpResponse<ThreatAgentMgm[]>> = this.threatAgentService.getDefaultThreatAgents();

        const myAnswersAndDefaultThreatAgentsJoin: Observable<any>[] = [];
        myAnswersAndDefaultThreatAgentsJoin.push(myAnswers$);
        myAnswersAndDefaultThreatAgentsJoin.push(defaultThreatAgents$);
        const myAnswersAndDefaultThreatAgentsJoin$: Observable<any> = forkJoin(myAnswersAndDefaultThreatAgentsJoin);

        // TODO Update the SelfAssessment with the identified ThreatAgents
        const selfAssessment$: Observable<HttpResponse<SelfAssessmentMgm>> = myAnswersAndDefaultThreatAgentsJoin$.pipe(
            mergeMap((responses: any[]) => {

                responses.forEach((value: any, index: number) => {
                    switch (index) {
                        case 0: {// TODO MyAnswers --> IdentifyThreatAgents
                            const myAnswersResponses = value as HttpResponse<MyAnswerMgm>[];

                            const identifiedThreatAgents: ThreatAgentMgm[] = [];
                            const threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[] = Array.from(threatAgentsPercentageMap.values());

                            threatAgentsPercentageArray.forEach((couple: Couple<ThreatAgentMgm, Fraction>) => {
                                const threatAgent: ThreatAgentMgm = couple.key;
                                const likelihood: Fraction = couple.value;
                                console.log('Threat-Agent: ' + JSON.stringify(threatAgent));
                                console.log('Likelihood: ' + likelihood.toPercentage());

                                if (likelihood.toPercentage() > 0) {
                                    identifiedThreatAgents.push(threatAgent);
                                }
                            });

                            const uniqueThreatAgentsSet: Set<ThreatAgentMgm> = new Set<ThreatAgentMgm>(identifiedThreatAgents.concat(this.selfAssessment.threatagents));
                            const uniqueThreatAgentsArray: ThreatAgentMgm[] = Array.from(uniqueThreatAgentsSet);
                            this.selfAssessment.threatagents = uniqueThreatAgentsArray;

                            break;
                        }
                        case 1: {// Default ThreatAgents
                            const defaultThreatAgents: ThreatAgentMgm[] = (responses[index] as HttpResponse<ThreatAgentMgm[]>).body;

                            const uniqueThreatAgentsSet: Set<ThreatAgentMgm> = new Set<ThreatAgentMgm>(defaultThreatAgents.concat(this.selfAssessment.threatagents));
                            const uniqueThreatAgentsArray: ThreatAgentMgm[] = Array.from(uniqueThreatAgentsSet);
                            this.selfAssessment.threatagents = uniqueThreatAgentsArray;

                            break;
                        }
                    }
                });

                this.selfAssessment.questionnaires = Array.from(new Set<QuestionnaireMgm>(this.selfAssessment.questionnaires.concat(this.questionnaire)));
                this.selfAssessment.user = this.user;

                return this.selfAssessmentService.update(this.selfAssessment);
            })
        );

        selfAssessment$.subscribe(
            (selfAssessmentResponse: HttpResponse<SelfAssessmentMgm>) => {
                this.selfAssessment = selfAssessmentResponse.body;
                this.selfAssessmentService.setSelfAssessment(this.selfAssessment);

                this.router.navigate(['/identify-threat-agent/result']);
            }
        );

        console.log('EXIT ==> Identify Threat-agents...');
    }

    private evaluateWeakness() {
        console.log('ENTER ==> Evaluating wekness...');
        console.log('OnSubmit called');
        console.log('Form\'s value is:');
        console.log(JSON.stringify(this.form.value));
        // TODO get the Questionnaire's Answers, persist them, update the matrix accordingly
        /**
         * Map representing the submitted form data.
         *
         * The key: string is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<string, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm> = FormUtils.formToMap<AnswerMgm>(this.form);
        console.log('FormDataMap size: ' + formDataMap.size);

        // Update the status of the questionnaire
        let questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.FULL, null, null, this.selfAssessment, this.questionnaire, this.role, this.user, []);

        // Persist the QuestionnaireStatus
        const selfAssessment$: Observable<HttpResponse<SelfAssessmentMgm>> =
            this.questionnaireStatusService.create(questionnaireStatus)
                .mergeMap(
                    (statusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                        questionnaireStatus = statusResponse.body;
                        console.log('QuestionnaireStatus: ' + JSON.stringify(questionnaireStatus));

                        // TODO persist MyAnswers
                        return this.createMyAnswersObservable(formDataMap, questionnaireStatus);
                    })
                .mergeMap(
                    (myAnswersResponse: HttpResponse<MyAnswerMgm[]>) => {
                        console.log('New MyAnswers created: ');
                        const myAnswers: MyAnswerMgm[] = myAnswersResponse.body;
                        console.log(JSON.stringify(myAnswers));

                        this.selfAssessment.questionnaires = Array.from(new Set<QuestionnaireMgm>(this.selfAssessment.questionnaires.concat(this.questionnaire)));
                        this.selfAssessment.user = this.user;

                        return this.selfAssessmentService.update(this.selfAssessment);
                    }
                );

        selfAssessment$.subscribe(
            (selfAssessmentResponse: HttpResponse<SelfAssessmentMgm>) => {
                this.selfAssessment = selfAssessmentResponse.body;
                this.selfAssessmentService.setSelfAssessment(this.selfAssessment);

                this.router.navigate(['/evaluate-weakness/result']);
            });

        // For now don't store the attackStrategies but recalculate them and their likelihood based on the stored MyAnswers
    }

    private externalAuditRefinement() {
        console.log('ENTER ==> Evaluating wekness...');
        console.log('OnSubmit called');
        console.log('Form\'s value is:');
        console.log(JSON.stringify(this.form.value));
        // TODO get the Questionnaire's Answers, persist them, update the matrix accordingly
        /**
         * Map representing the submitted form data.
         *
         * The key: string is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<string, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm | string> = FormUtils.formToMap<AnswerMgm | string>(this.form);
        console.log('FormDataMap size: ' + formDataMap.size);

        // Create the status of the questionnaire
        let questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.FULL, null, null, this.selfAssessment, this.questionnaire, this.role, this.user, []);

        const myRefinementAnswers: Observable<HttpResponse<MyAnswerMgm[]>> = this.questionnaireStatusService.create(questionnaireStatus)
            .mergeMap(
                (statusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                    questionnaireStatus = statusResponse.body;
                    console.log('QuestionnaireStatus: ' + JSON.stringify(questionnaireStatus));

                    // TODO persist MyAnswers
                    return this.createMyRefinementAnswersObservable(formDataMap, questionnaireStatus);
                });

        myRefinementAnswers.subscribe((response: HttpResponse<MyAnswerMgm[]>) => {
            console.log('MyAnswers: ' + JSON.stringify(response));
            this.router.navigate(['/evaluate-weakness/result']);
        });
    }

    freezeQuestionnaireStatus() {
        console.log('Freezing questionnaire status...');
        /**
         * Map representing the submitted form data.
         *
         * The key: string is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<string, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm> = FormUtils.formToMap<AnswerMgm>(this.form);
        console.log('FormData: ' + formDataMap);
        console.log('FormDataMap Size: ' + formDataMap.size);

        switch (this.questionnaireStatus.status) {
            case Status.EMPTY: {// create a new QuestionnaireStatus && create MyAnswers
                /**
                 * The PENDING status for the questionnaire.
                 * @type {QuestionnaireStatusMgm}
                 */
                this.questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.PENDING, null, null, this.selfAssessment, this._questionnaire, this.role, this.user, []);

                // Getting the id of the above QuestionnaireStatus
                this.subscriptions.push(
                    this.questionnaireStatusService.create(this.questionnaireStatus).subscribe(
                        (statusResponse) => {
                            this.questionnaireStatus = statusResponse.body;

                            // CREATE the NEW MyAnswers
                            const createObservables: Observable<HttpResponse<MyAnswerMgm[]>> = this.createMyAnswersObservable(formDataMap, this.questionnaireStatus);

                            createObservables.subscribe(
                                (myAnswersResponse: HttpResponse<MyAnswerMgm[]>) => {
                                    console.log('New MyAnswers created: ');
                                    const myAnswers: MyAnswerMgm[] = myAnswersResponse.body;
                                    console.log(JSON.stringify(myAnswers));
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
                const deleteObservables: Observable<HttpResponse<MyAnswerMgm>>[] = this.deleteMyAnswersObservable(this.myAnswers);

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
                const createObservables: Observable<HttpResponse<MyAnswerMgm[]>> = this.createMyAnswersObservable(formDataMap, this.questionnaireStatus);

                createObservables.subscribe(
                    (myAnswersResponse: HttpResponse<MyAnswerMgm[]>) => {
                        console.log('New MyAnswers created: ');
                        const myAnswers: MyAnswerMgm[] = myAnswersResponse.body;
                        console.log(JSON.stringify(myAnswers));
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

    private myAnswersToFormValue(myAnswers: MyAnswerMgm[], questionsMap: Map<number, QuestionMgm>) {
        console.log('MyAnswers to FormValue...');
        console.log('MyAnswers: ' + JSON.stringify(myAnswers));
        console.log('QuestionsMap size: ' + questionsMap.size);

        const value = {};

        myAnswers.forEach(
            (myAnswer) => {
                console.log('MyAnswer: ' + JSON.stringify(myAnswer));

                // Get the "exact" QUESTION used in the form generation
                const question = questionsMap.get(myAnswer.question.id);
                console.log('Question: ' + JSON.stringify(question));

                // Get the "exact" ANSWERS used as [VALUE] for the question
                const answers: AnswerMgm[] = question.answers;
                console.log('Answers: ' + JSON.stringify(answers));

                let exactAnswer: AnswerMgm;
                console.log('For each answers...');

                for (const answer of answers) {
                    console.log('Answer ID: ' + answer.id + '==> MyAnswer ID: ' + myAnswer.answer.id);

                    if (answer.id === myAnswer.answer.id) {
                        exactAnswer = answer;
                        break;
                    }
                }

                console.log('Exact Answer: ' + JSON.stringify(exactAnswer));

                value[String(myAnswer.question.id)] = exactAnswer;
            }
        );

        console.log('Patching values: ' + JSON.stringify(value));

        return value;
    }

    private createMyAnswersObservable(formDataMap: Map<string, AnswerMgm>, questionnaireStatus: QuestionnaireStatusMgm):

        Observable<HttpResponse<MyAnswerMgm[]>> {

        // CREATE the NEW MyAnswers
        //const createMyAnswersObservable: Observable<HttpResponse<MyAnswerMgm[]>> = [];
        const myAnswers:
            MyAnswerMgm[] = [];

        formDataMap.forEach(
            (value: AnswerMgm, key: string) => {
                const answer: AnswerMgm = value;
                console.log('Answer: ' + answer);

                if (answer) {// check if the the user answered this question
                    const question: QuestionMgm = this.questionsArrayMap.get(Number(key));
                    const questionnaire: QuestionnaireMgm = question.questionnaire;

                    console.log('Answer: ' + JSON.stringify(answer));
                    console.log('Question: ' + JSON.stringify(question));
                    console.log('Questionnaire: ' + JSON.stringify(questionnaire));

                    const myAnser: MyAnswerMgm = new MyAnswerMgm(undefined, 'Checked', 0, answer, question, questionnaire, questionnaireStatus, this.user);

                    console.log('MyAnser: ' + myAnser);

                    myAnswers.push(myAnser);
                }
            }
        );

        return this.myAnswerService.createAll(myAnswers);
    }

    private deleteMyAnswersObservable(myAnswers: MyAnswerMgm[]):

        Observable<HttpResponse<MyAnswerMgm>>[] {// DELETE the OLD MyAnswers
        const deleteMyAnswerObservable: Observable<HttpResponse<MyAnswerMgm>> [] = [];

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
        //const createMyAnswersObservable: Observable<HttpResponse<MyAnswerMgm[]>> = [];
        const myAnswers: MyAnswerMgm[] = [];

        //Contains the Answers of the External Audit
        const refinementMap: Map<number/*Question.ID*/, AnswerMgm> = new Map<number, AnswerMgm>();

        //Contains the notes of the External Audit
        const notesMap: Map<number/*Qestion.ID*/, string> = new Map<number, string>();

        formDataMap.forEach(// Key could be id | id.external | id.note
            (value: AnswerMgm | string, key: string) => {

                if (key.endsWith('.external')) {
                    const answer: AnswerMgm = value as AnswerMgm;
                    console.log('Answer: ' + answer);

                    const questionID: number = Number(key.replace('.external', ''));
                    const question: QuestionMgm = this.questionsArrayMap.get(questionID);

                    refinementMap.set(question.id, answer);
                } else if (key.endsWith('.note')) {
                    const note: string = value as string;
                    console.log('Note: ' + note);

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

        return this.myAnswerService.createAll(myAnswers);
    }
}
