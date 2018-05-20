import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuestionControlService} from './services/question-control.service';
import {FormGroup} from '@angular/forms';
import {QuestionMgm, QuestionMgmService} from '../../../../entities/question-mgm';
import {AnswerMgm} from '../../../../entities/answer-mgm';
import {ThreatAgentMgm} from '../../../../entities/threat-agent-mgm';
import {Fraction} from '../../../../utils/fraction.class';
import * as CryptoJS from 'crypto-js';
import {Couple} from '../../../../utils/couple.class';
import {DatasharingService} from '../../../../datasharing/datasharing.service';
import {Router} from '@angular/router';
import {
    QuestionnaireStatusMgm, QuestionnaireStatusMgmService, Status
} from '../../../../entities/questionnaire-status-mgm';
import {QuestionnaireMgm} from '../../../../entities/questionnaire-mgm';
import {MyAnswerMgm, MyAnswerMgmService} from '../../../../entities/my-answer-mgm';
import {AccountService, User, UserService} from '../../../../shared';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../../../entities/self-assessment-mgm';
import {Subscription} from 'rxjs/Subscription';
import {FormUtils} from '../../../utils/FormUtils';
import {Likelihood} from '../../../../entities/answer-weight-mgm';

@Component({
    selector: 'jhi-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styles: [],
    providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit, OnDestroy {
    private static YES: String = 'YES';
    private static NO: String = 'NO';
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

            if (this.myAnswers) {
                this.form.patchValue(this.myAnswersToFormValue(this.myAnswers));
            }

            this._questionsArrayMap = new Map<number, QuestionMgm>();
            this._questionsArray.forEach((question) => {
                this._questionsArrayMap.set(question.id, question);
            });
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

    @Input()
    set questionnaireStatus(status: QuestionnaireStatusMgm) {
        this._questionnaireStatus = status;

        switch (this._questionnaireStatus.status) {
            case Status.EMPTY: {

                break;
            }
            case Status.PENDING: {
                console.log('Status PENDING case');

                this.myAnswerService.getAllByQuestionnaireStatusID(this.questionnaireStatus.id).subscribe(
                    (response) => {
                        this.myAnswers = response as MyAnswerMgm[];

                        if (this.form) {
                            this.form.patchValue(this.myAnswersToFormValue(this.myAnswers));
                        }
                    }
                );

                break;
            }
            case Status.FULL: {

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

    identifyThreatAgents() {
        console.log('OnSubmit called');
        console.log('Form\'s value is:');
        console.log(JSON.stringify(this.form.value));

        /**
         * Map representing the submitted form data.
         *
         * The key: String is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<String, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm> = FormUtils.formToMap<AnswerMgm>(this.form);

        this.dataSharingSerivce.identifyThreatAgentsFormDataMap = formDataMap;

        /**
         * The key: String is the SHA256 of the ThreatAgent JSON
         * The value: Couple<ThreatAgentMgm, Fraction> contains the ThreatAgent itself
         * and the fraction of YES answers over all te questions identifying that ThreatAgent.
         * @type {Map<String, Couple<ThreatAgentMgm, Fraction>>}
         */
        const threatAgentsPercentageMap: Map<String, Couple<ThreatAgentMgm, Fraction>> = new Map<String, Couple<ThreatAgentMgm, Fraction>>();

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

                if (answer.name === DynamicFormComponent.YES) {
                    console.log('Warning: you answered YES');
                    fraction.part++;
                } else if (answer.name === DynamicFormComponent.NO) {
                    console.log('Good, you answered NO');
                }
            } else {// first time
                console.log('First Time processing this threat agent');

                const fraction = new Fraction(0, 1);
                threatAgentsPercentageMap.set(threatAgentHash, new Couple<ThreatAgentMgm, Fraction>(threatAgent, fraction));

                if (answer.name === DynamicFormComponent.YES) {
                    console.log('Warning: you answered YES');
                    fraction.part++;
                } else if (answer.name === DynamicFormComponent.NO) {
                    console.log('Good, you answered NO');
                }
            }
        });

        console.log('Threat agents percentage map size: ' + threatAgentsPercentageMap.size);
        console.log(('Begin looping threat agents percentage map...'));

        threatAgentsPercentageMap.forEach((value, key) => {
            console.log('ThreatAgent:' + key + ' ==> ' + value.key.name + '\t' + value.value.toPercentage() + '\%');
        });

        console.log(('Begin looping threat agents percentage map...'));

        this.dataSharingSerivce.threatAgentsMap = threatAgentsPercentageMap;

        this.router.navigate(['/identify-threat-agent/result']);
    }

    freezeQuestionnaireStatus() {
        console.log('Freezing questionnaire status...');
        /**
         * Map representing the submitted form data.
         *
         * The key: String is the ID of the Question
         * The value: AnswerMgm is the selected Answer
         * @type {Map<String, AnswerMgm>}
         */
        const formDataMap: Map<string, AnswerMgm> = FormUtils.formToMap<AnswerMgm>(this.form);
        console.log('FormData: ' + formDataMap);
        console.log('FormDataMap Size: ' + formDataMap.size);
        /**
         * The PENDING status for the questionnaire.
         * @type {QuestionnaireStatusMgm}
         */
        let questionnaireStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined, Status.PENDING, this.selfAssessment, this._questionnaire, this.user, []);

        // Getting the id of the above QuestionnaireStatus
        this.subscriptions.push(
            this.questionnaireStatusService.create(questionnaireStatus).subscribe(
                (statusResponse) => {
                    questionnaireStatus = statusResponse.body;

                    formDataMap.forEach((value: AnswerMgm, key: String) => {
                        const answer: AnswerMgm = value;
                        console.log('Answer: ' + answer);

                        if (answer) {
                            const question: QuestionMgm = this._questionsArrayMap.get(Number(key));
                            const questionnaire: QuestionnaireMgm = question.questionnaire;

                            console.log('Answer: ' + JSON.stringify(answer));
                            console.log('Question: ' + JSON.stringify(question));
                            console.log('Questionnaire: ' + JSON.stringify(questionnaire));

                            const myAnser: MyAnswerMgm = new MyAnswerMgm(undefined, 'Checked', answer, question, questionnaire, questionnaireStatus, this.user);

                            console.log('MyAnser: ' + myAnser);

                            // persist the answer of the user
                            this.myAnswerService.create(myAnser).subscribe((response) => {
                                const result: MyAnswerMgm = response.body;
                                console.log('MyAnswer response: ' + JSON.stringify(result));
                            });
                        }
                    });
                },
                (error: any) => {
                    console.log(error);
                },
                () => {
                    this.router.navigate(['identify-threat-agent/questionnaires']);
                })
        );
    }

    patchValues() {
        console.log('Form value before: ' + JSON.stringify(this.form.value));

        const value = {};
        value[1] = this._questionsArrayMap.get(1).answers[0]; // YES
        value[2] = this._questionsArrayMap.get(2).answers[0]; // YES
        value[3] = this._questionsArrayMap.get(3).answers[1]; // NO

        console.log('Patching values: ' + JSON.stringify(value));

        this.form.patchValue(value);

        console.log('Form value after: ' + JSON.stringify(this.form.value));
    }

    sort(answers: AnswerMgm[]): AnswerMgm[] {
        return answers.sort((a, b) => {
            return a.order - b.order;
        });
    }

    private myAnswersToFormValue(myAnswers: MyAnswerMgm[]) {
        const value = {};

        this.myAnswers.forEach((myAnswer) => {
            value[myAnswer.question.id] = myAnswer.answer;
        });

        console.log('Patching values: ' + JSON.stringify(value));

        return value;
    }
}
