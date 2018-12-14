import {Injectable} from '@angular/core';
import {Fraction} from '../utils/fraction.class';
import {Couple} from '../utils/couple.class';
import {ThreatAgentMgm} from '../entities/threat-agent-mgm';
import {AnswerMgm} from '../entities/answer-mgm';
import {QuestionMgm} from '../entities/question-mgm';
import {QuestionnaireStatusMgm} from '../entities/questionnaire-status-mgm';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AttackStrategyMgm} from '../entities/attack-strategy-mgm';
import {AttackStrategyUpdate} from '../evaluate-weakness/models/attack-strategy-update.model';
import {QuestionnaireMgm} from '../entities/questionnaire-mgm';
import {Update} from '../layouts/model/Update';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DatasharingService {

    private _threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private _identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;
    private _currentQuestionnaire: QuestionnaireMgm;
    private _questionnaireStatusesMap: Map<number, QuestionnaireStatusMgm>;
    private _questionnaireStatus: QuestionnaireStatusMgm;

    // ===Observables-BehaviorSubjects===

    // Map to keep the previous updated answers.
    private _attackStrategyUpdatesMap: Map<number/*AttackStrategy ID*/, Couple<AttackStrategyMgm, AttackStrategyUpdate>> =
        new Map<number, Couple<AttackStrategyMgm, AttackStrategyUpdate>>();
    // Single AttackStrategy update
    private _attackStrategyUpdate: AttackStrategyUpdate;
    private _attackStrategyUpdateSubject: BehaviorSubject<AttackStrategyUpdate> = new BehaviorSubject<AttackStrategyUpdate>(this._attackStrategyUpdate);
    private _attackStrategyUpdate$: Observable<AttackStrategyUpdate> = this._attackStrategyUpdateSubject.asObservable();
    private layoutUpdateSubject: BehaviorSubject<Update> = new BehaviorSubject<Update>(null);
    private mySelfAssessmentSubject: BehaviorSubject<SelfAssessmentMgm> = new BehaviorSubject<SelfAssessmentMgm>(null);

    constructor(private http: HttpClient) {

    }

    set threatAgentsMap(threatAgents: Map<String, Couple<ThreatAgentMgm, Fraction>>) {
        console.log('ThreatAgents param was: ' + JSON.stringify(threatAgents));

        this._threatAgentsMap = threatAgents;
        console.log('ThreatAgents SET to ' + JSON.stringify(this._threatAgentsMap));
    }

    get threatAgentsMap(): Map<String, Couple<ThreatAgentMgm, Fraction>> {
        console.log('ThreatAgents GET to ' + JSON.stringify(this._threatAgentsMap));

        return this._threatAgentsMap;
    }

    get identifyThreatAgentsFormDataMap(): Map<String, AnswerMgm> {
        return this._identifyThreatAgentsFormDataMap;
    }

    set identifyThreatAgentsFormDataMap(value: Map<String, AnswerMgm>) {
        this._identifyThreatAgentsFormDataMap = value;
    }

    get currentQuestionnaire(): QuestionnaireMgm {
        return this._currentQuestionnaire;
    }

    set currentQuestionnaire(value: QuestionnaireMgm) {
        this._currentQuestionnaire = value;
    }

    get questionnaireStatusesMap(): Map<number, QuestionnaireStatusMgm> {
        return this._questionnaireStatusesMap;
    }

    set questionnaireStatusesMap(statusesMap: Map<number, QuestionnaireStatusMgm>) {
        this._questionnaireStatusesMap = statusesMap;
    }

    get questionnaireStatus(): QuestionnaireStatusMgm {
        return this._questionnaireStatus;
    }

    set questionnaireStatus(value: QuestionnaireStatusMgm) {
        this._questionnaireStatus = value;
    }

    // private sendRiskProfileToKafkaUrl = SERVER_API_URL + "api/{selfAssessmentID}/risk-profile/kafka";

    private set attackStrategyUpdate(value: AttackStrategyUpdate) {
        this._attackStrategyUpdate = value;
        // Broadcast the new value
        this._attackStrategyUpdateSubject.next(this._attackStrategyUpdate);
    }

    get attackStrategyUpdate$() {
        return this._attackStrategyUpdate$;
    }

    answerSelfAssessment(question: QuestionMgm, answer: AnswerMgm) {
        console.log('ENTER answer SelfAssessment...');
        console.log('Question: ' + JSON.stringify(question));

        for (const attackStrategy of question.attackStrategies) {
            console.log('AttackStrategy: ' + JSON.stringify(attackStrategy));

            // Placeholder for the new update
            let attackStrategyUpdate: AttackStrategyUpdate;

            if (this._attackStrategyUpdatesMap.has(attackStrategy.id)) {
                attackStrategyUpdate = this._attackStrategyUpdatesMap.get(attackStrategy.id).value;
            } else {
                attackStrategyUpdate = new AttackStrategyUpdate(attackStrategy, new Map<number, Couple<QuestionMgm, AnswerMgm>>());
                this._attackStrategyUpdatesMap.set(attackStrategy.id, new Couple<AttackStrategyMgm, AttackStrategyUpdate>(attackStrategy, attackStrategyUpdate));
            }

            const questionsAnswerMap: Map<number, Couple<QuestionMgm, AnswerMgm>> = attackStrategyUpdate.questionsAnswerMap;

            if (questionsAnswerMap.has(question.id)) {//
                const oldAnswer: AnswerMgm = questionsAnswerMap.get(question.id).value;
                console.log('The old answer was: ' + JSON.stringify(oldAnswer));
            } else {
                console.log('First time answering this quesion...');
            }

            questionsAnswerMap.set(question.id, new Couple<QuestionMgm, AnswerMgm>(question, answer));
            console.log('Answer was updated: ' + JSON.stringify(answer));
            // Set & Broadcast the update for the current AttackStrategy
            this.attackStrategyUpdate = attackStrategyUpdate;
        }
    }

    updateLayout(layoutUpdate: Update) {
        this.layoutUpdateSubject.next(layoutUpdate);
    }

    getUpdate(): Update {
        return this.layoutUpdateSubject.getValue();
    }

    observeUpdate(): Observable<Update> {
        return this.layoutUpdateSubject.asObservable();
    }

    updateMySelfAssessment(mySelf: SelfAssessmentMgm) {
        this.mySelfAssessmentSubject.next(mySelf);
    }

    getMySelfAssessment(): SelfAssessmentMgm {
        return this.mySelfAssessmentSubject.getValue();
    }

    observeMySelf(): Observable<SelfAssessmentMgm> {
        return this.mySelfAssessmentSubject.asObservable();
    }

    clear() {
        this.mySelfAssessmentSubject.next(null);
        this.layoutUpdateSubject.next(null);
        this._attackStrategyUpdateSubject.next(null);
    }

    /*sendRsikProfileToKafka(selfAssessmentID: number): Observable<HttpResponse<void>> {
        const uri = this.sendRiskProfileToKafkaUrl.replace('{selfAssessmentID}', String(selfAssessmentID));

        return this.http.get<void>(uri, {observe: 'response'})
            .map((res: HttpResponse<void>) => res);
    }*/
}
