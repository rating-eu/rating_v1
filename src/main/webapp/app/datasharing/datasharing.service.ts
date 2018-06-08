import {Injectable} from '@angular/core';
import {Fraction} from '../utils/fraction.class';
import {Couple} from '../utils/couple.class';
import {ThreatAgentMgm} from '../entities/threat-agent-mgm';
import {AnswerMgm} from '../entities/answer-mgm';
import {QuestionMgm} from '../entities/question-mgm';
import {QuestionnaireStatusMgm} from '../entities/questionnaire-status-mgm';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AttackStrategyMgm} from '../entities/attack-strategy-mgm';

@Injectable()
export class DatasharingService {

    private _threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;

    set threatAgentsMap(threatAgents: Map<String, Couple<ThreatAgentMgm, Fraction>>) {
        console.log('ThreatAgents param was: ' + JSON.stringify(threatAgents));

        this._threatAgentsMap = threatAgents;
        console.log('ThreatAgents SET to ' + JSON.stringify(this._threatAgentsMap));
    }

    get threatAgentsMap(): Map<String, Couple<ThreatAgentMgm, Fraction>> {
        console.log('ThreatAgents GET to ' + JSON.stringify(this._threatAgentsMap));

        return this._threatAgentsMap;
    }

    private _identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;

    get identifyThreatAgentsFormDataMap(): Map<String, AnswerMgm> {
        return this._identifyThreatAgentsFormDataMap;
    }

    set identifyThreatAgentsFormDataMap(value: Map<String, AnswerMgm>) {
        this._identifyThreatAgentsFormDataMap = value;
    }

    private _currentQuestionnaire: QuestionMgm;

    get currentQuestionnaire(): QuestionMgm {
        return this._currentQuestionnaire;
    }

    set currentQuestionnaire(value: QuestionMgm) {
        this._currentQuestionnaire = value;
    }

    private _questionnaireStatusesMap: Map<number, QuestionnaireStatusMgm>;

    get questionnaireStatusesMap(): Map<number, QuestionnaireStatusMgm> {
        return this._questionnaireStatusesMap;
    }

    set questionnaireStatusesMap(statusesMap: Map<number, QuestionnaireStatusMgm>) {
        this._questionnaireStatusesMap = statusesMap;
    }

    private _questionnaireStatus: QuestionnaireStatusMgm;

    get questionnaireStatus(): QuestionnaireStatusMgm {
        return this._questionnaireStatus;
    }

    set questionnaireStatus(value: QuestionnaireStatusMgm) {
        this._questionnaireStatus = value;
    }

    // ===Observables-BehaviorSubjects===
    /**
     * For each AttackStrategy, we have the corresponding Map of Question and Answers.
     * AttackStrategy.ID ==> (AttackStrategy, {Question.ID ==> (Question, Answer)})
     * @type {Map<string, Couple<AttackStrategyMgm, Couple<QuestionMgm, AnswerMgm>[]>>}
     * @private
     */
    private _selfAssessmentAttackStrategyAnswersMap: Map</*AttackStrategy.ID*/number, Couple<AttackStrategyMgm, Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>>>> = new Map<number, Couple<AttackStrategyMgm, Map<number, Couple<QuestionMgm, AnswerMgm>>>>();// property
    private _selfAssessmentAnswersSubject = new BehaviorSubject(this._selfAssessmentAttackStrategyAnswersMap);// subject
    private _selfAssessmentAnswers$ = this._selfAssessmentAnswersSubject.asObservable();// observable

    set selfAssessmentAttackStrategyAnswersMap(value: Map<number, Couple<AttackStrategyMgm, Map<number, Couple<QuestionMgm, AnswerMgm>>>>) {
        this._selfAssessmentAttackStrategyAnswersMap = value;
        // Broadcast the new value
        this._selfAssessmentAnswersSubject.next(this._selfAssessmentAttackStrategyAnswersMap);
    }

    set x(value: Map<number, Couple<AttackStrategyMgm, Map<number, Couple<QuestionMgm, AnswerMgm>>>>) {
        this._selfAssessmentAttackStrategyAnswersMap = value;
        // Broadcast the new value
        this._selfAssessmentAnswersSubject.next(this._selfAssessmentAttackStrategyAnswersMap);
    }

    /**
     * Get the observable for the answers of the current SelfAssessment
     * @returns {Observable<{}>}
     */
    get selfAssessmentAnswers$(): Observable<{}> {
        return this._selfAssessmentAnswers$;
    }

    answerSelfAssessment(question: QuestionMgm, answer: AnswerMgm) {
        console.log('Question: ' + JSON.stringify(question));

        for (let attackStrategy of question.attackStrategies) {
            console.log('AttackStrategy: ' + JSON.stringify(attackStrategy));

            if (this._selfAssessmentAttackStrategyAnswersMap.has(attackStrategy.id)) {
                const couple: Couple<AttackStrategyMgm, Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>>> = this._selfAssessmentAttackStrategyAnswersMap.get(attackStrategy.id);
                const questionsMap: Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>> = couple.value;

                //check if an old answer exists
                if (questionsMap.has(question.id)) {//
                    const oldAnswer: AnswerMgm = questionsMap.get(question.id).value;
                    console.log('The old answer was: ' + JSON.stringify(oldAnswer));
                } else {
                    console.log('First time answering this quesion...');
                }

                questionsMap.set(question.id, new Couple<QuestionMgm, AnswerMgm>(question, answer));
                console.log('Answer was updated: ' + JSON.stringify(answer));
            } else {
                // create a new couple for the current AttackStrategy
                const couple: Couple<AttackStrategyMgm, Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>>> = new Couple<AttackStrategyMgm, Map<number, Couple<QuestionMgm, AnswerMgm>>>(attackStrategy, null);
                // create a new map for the questions about the current AttackStrategy
                const questionsMap: Map</*Question.ID*/number, Couple<QuestionMgm, AnswerMgm>> = new Map<number, Couple<QuestionMgm, AnswerMgm>>();
                // set the answer for the question
                questionsMap.set(question.id, new Couple<QuestionMgm, AnswerMgm>(question, answer));

                couple.value = questionsMap;
                this._selfAssessmentAttackStrategyAnswersMap.set(attackStrategy.id, couple);
            }
        }

        //broadcast the update
        this.selfAssessmentAttackStrategyAnswersMap = this._selfAssessmentAttackStrategyAnswersMap;
    }
}
