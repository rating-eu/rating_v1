import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuestionControlService} from './services/question-control.service';
import {AbstractControl, FormGroup} from '@angular/forms';
import {QuestionMgm, QuestionMgmService} from '../../../../entities/question-mgm';
import {AnswerMgm, AnswerMgmService} from '../../../../entities/answer-mgm';
import {ThreatAgentMgm} from '../../../../entities/threat-agent-mgm';
import {Fraction} from '../../../../utils/fraction.class';
import * as CryptoJS from 'crypto-js';
import {Couple} from '../../../../utils/couple.class';
import {DatasharingService} from '../../../../datasharing/datasharing.service';
import {Router} from '@angular/router';
import {
    QuestionnaireStatusMgm, QuestionnaireStatusMgmService, Status
} from '../../../../entities/questionnaire-status-mgm';
import {QuestionnaireMgm, QuestionnairePurpose} from '../../../../entities/questionnaire-mgm';
import {MyAnswerMgm, MyAnswerMgmService} from '../../../../entities/my-answer-mgm';
import {AccountService, User, UserService} from '../../../../shared';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../../../entities/self-assessment-mgm';
import {Subscription} from 'rxjs/Subscription';
import {FormUtils} from '../../../utils/FormUtils';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {Observable} from 'rxjs/Observable';
import {HttpResponse} from '@angular/common/http';

@Component({
    selector: 'jhi-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styles: [],
    providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit, OnDestroy {

    private static YES = 'YES';
    private static NO = 'NO';
    private statusEnum = Status;

    debug = false;

    _questionsArray: QuestionMgm[];
    /**
     * Map QuestionID ==> Question
     */
    _questionsArrayMap: Map<number, QuestionMgm>;
    form: FormGroup;
    _questionnaireStatus: QuestionnaireStatusMgm;

    myAnswers: MyAnswerMgm[];

    private account: Account;
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
                private accountService: AccountService,
                private userService: UserService, private questionService: QuestionMgmService) {
    }

    @Input()
    set questionsArray(questionsArray: QuestionMgm[]) {
        console.log('QuestionsArray changed...');
        this._questionsArray = questionsArray;
        console.log('Now its ' + this._questionsArray);

        // Now we can create the form, since the questionsArray is no more undefined
        if (this._questionsArray) {
            this.form = this.questionControlService.toFormGroup(this._questionsArray);
            console.log('Form has been created...');
            console.log('Form is: ' + this.form);

            this._questionsArrayMap = new Map<number, QuestionMgm>();

            this._questionsArray.forEach((value: QuestionMgm) => {
                this._questionsArrayMap.set(value.id, value);
            });

            if (this.myAnswers) {
                this.form.patchValue(this.myAnswersToFormValue(this.myAnswers, this._questionsArrayMap));
            }

            if (this.questionnaire.purpose === QuestionnairePurpose.SELFASSESSMENT) {
                for (const key in this.form.controls) {
                    const formControl = this.form.get(key);

                    if (formControl) {
                        formControl.valueChanges.subscribe(
                            (answer: AnswerMgm) => {
                                console.log('Question ' + key + ' Field changes:');

                                const question = this._questionsArrayMap.get(Number(key));
                                console.log('Question:');
                                console.log(JSON.stringify(question));

                                console.log('Answer:');
                                console.log(JSON.stringify(answer));

                                this.dataSharingSerivce.answerSelfAssessment(question, answer);
                            }
                        )
                    }
                }
            }
        }
    }

    get questionsArray() {
        return this._questionsArray;
    }

    @Input()
    set questionnaire(questionnaire: QuestionnaireMgm) {
        console.log('Questionnaire coming from @INPUT: ' + JSON.stringify(questionnaire));
        this._questionnaire = questionnaire;
    }

    get questionnaire() {
        return this._questionnaire;
    }

    @Input()
    set questionnaireStatus(status: QuestionnaireStatusMgm) {
        console.log('Questionnaire status input: ' + JSON.stringify(status));

        this._questionnaireStatus = status;

        switch (this._questionnaireStatus.status) {
            case Status.EMPTY: {
                console.log('Status EMPTY');

                break;
            }
            case Status.PENDING: {
                console.log('Status PENDING');

                this.myAnswerService.getAllByQuestionnaireStatusID(this.questionnaireStatus.id).subscribe(
                    (response) => {
                        this.myAnswers = response as MyAnswerMgm[];

                        if (this.form) {
                            this.form.patchValue(this.myAnswersToFormValue(this.myAnswers, this._questionsArrayMap));
                        }
                    }
                );

                break;
            }
            case Status.FULL: {
                console.log('Status FULL');

                break;
            }
            default: {
                console.log('Status DEFAULT case');
            }
        }
    }

    get questionnaireStatus() {
        return this._questionnaireStatus;
    }

    isValid(questionID) {
        return this.form.controls[questionID].valid;
    }

    trackByID(index, question: QuestionMgm) {
        return question.id;
    }

    ngOnInit() {
        this.selfAssessment = this.selfAssessmentService.getSelfAssessment();

        this.subscriptions.push(
            this.accountService.get().subscribe((response1) => {
                this.account = response1.body;

                this.subscriptions.push(
                    this.userService.find(this.account['login']).subscribe((response2) => {
                        this.user = response2.body;
                    })
                );
            })
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
                this.evaluateWeakness();
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

    identifyThreatAgents() {
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

            const question: QuestionMgm = this._questionsArrayMap.get(Number(key));
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

        this.router.navigate(['/identify-threat-agent/result']);

        console.log('EXIT ==> Identify Threat-agents...');
    }

    evaluateWeakness() {
        console.log('Evaluating wekness...');
        // TODO get the Questionnaire's Answers, persist them, update the matrix accordingly

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

        switch (this._questionnaireStatus.status) {
            case Status.EMPTY: {// create a new QuestionnaireStatus && create MyAnswers
                /**
                 * The PENDING status for the questionnaire.
                 * @type {QuestionnaireStatusMgm}
                 */
                this._questionnaireStatus = new QuestionnaireStatusMgm(undefined, Status.PENDING, this.selfAssessment, this._questionnaire, this.user, []);

                // Getting the id of the above QuestionnaireStatus
                this.subscriptions.push(
                    this.questionnaireStatusService.create(this._questionnaireStatus).subscribe(
                        (statusResponse) => {
                            this._questionnaireStatus = statusResponse.body;

                            // CREATE the NEW MyAnswers
                            const createObservables: Observable<HttpResponse<MyAnswerMgm>>[] = [];

                            formDataMap.forEach((value: AnswerMgm, key: string) => {
                                const answer: AnswerMgm = value;
                                console.log('Answer: ' + answer);

                                if (answer) {// check if the the user answered this question
                                    const question: QuestionMgm = this._questionsArrayMap.get(Number(key));
                                    const questionnaire: QuestionnaireMgm = question.questionnaire;

                                    console.log('Answer: ' + JSON.stringify(answer));
                                    console.log('Question: ' + JSON.stringify(question));
                                    console.log('Questionnaire: ' + JSON.stringify(questionnaire));

                                    const myAnser: MyAnswerMgm = new MyAnswerMgm(undefined, 'Checked', answer, question, questionnaire, this._questionnaireStatus, this.user);

                                    console.log('MyAnser: ' + myAnser);

                                    createObservables.push(this.myAnswerService.create(myAnser));
                                }
                            });

                            forkJoin(createObservables).subscribe((responses: HttpResponse<MyAnswerMgm>[]) => {
                                    console.log('New my answers creaed: ' + JSON.stringify(responses));
                                },
                                (error) => {
                                    console.log(error);
                                },
                                () => {
                                    console.log('Create Observables completed...');
                                    this.router.navigate(['identify-threat-agent/questionnaires']);
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
                const deleteObservables: Observable<HttpResponse<any>>[] = [];

                this.myAnswers.forEach((myAnswer) => {
                    deleteObservables.push(
                        this.myAnswerService.delete(myAnswer.id)
                    );
                });

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
                const createObservables: Observable<HttpResponse<MyAnswerMgm>>[] = [];

                formDataMap.forEach((value: AnswerMgm, key: string) => {
                    const answer: AnswerMgm = value;
                    console.log('Answer: ' + answer);

                    if (answer) {// check if the the user answered this question
                        const question: QuestionMgm = this._questionsArrayMap.get(Number(key));
                        const questionnaire: QuestionnaireMgm = question.questionnaire;

                        console.log('Answer: ' + JSON.stringify(answer));
                        console.log('Question: ' + JSON.stringify(question));
                        console.log('Questionnaire: ' + JSON.stringify(questionnaire));

                        const myAnser: MyAnswerMgm = new MyAnswerMgm(undefined, 'Checked', answer, question, questionnaire, this._questionnaireStatus, this.user);

                        console.log('MyAnser: ' + myAnser);

                        createObservables.push(this.myAnswerService.create(myAnser));
                    }
                });

                forkJoin(createObservables).subscribe((responses: HttpResponse<MyAnswerMgm>[]) => {
                        console.log('New my answers creaed: ' + JSON.stringify(responses));
                    },
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        console.log('Create Observables completed...');
                        this.router.navigate(['identify-threat-agent/questionnaires']);
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
        });
    }

    private myAnswersToFormValue(myAnswers: MyAnswerMgm[], questionsMap: Map<number, QuestionMgm>) {
        console.log('MyAnswers to FormValue...');
        console.log('MyAnswers: ' + JSON.stringify(myAnswers));
        console.log('QuestionsMap size: ' + questionsMap.size);

        const value = {};

        myAnswers.forEach((myAnswer) => {
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
        });

        console.log('Patching values: ' + JSON.stringify(value));

        return value;
    }
}
