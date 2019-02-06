import {Injectable} from '@angular/core';
import {Fraction} from '../utils/fraction.class';
import {Couple} from '../utils/couple.class';
import {ThreatAgentMgm} from '../entities/threat-agent-mgm';
import {AnswerMgm} from '../entities/answer-mgm';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {QuestionnaireMgm} from '../entities/questionnaire-mgm';
import {Update} from '../layouts/model/Update';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {HttpClient} from '@angular/common/http';
import {MyRole} from '../entities/enumerations/MyRole.enum';

@Injectable()
export class DatasharingService {

    private _threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private _identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;
    private _currentQuestionnaire: QuestionnaireMgm;

    // ===Observables-BehaviorSubjects===

    // Map to keep the previous updated answers.
    // Single AttackStrategy update
    private layoutUpdateSubject: BehaviorSubject<Update> = new BehaviorSubject<Update>(null);
    private mySelfAssessmentSubject: BehaviorSubject<SelfAssessmentMgm> = new BehaviorSubject<SelfAssessmentMgm>(null);
    private roleSubject: BehaviorSubject<MyRole> = new BehaviorSubject<MyRole>(null);
    private role: MyRole = null;

    constructor(private http: HttpClient) {

    }

    set threatAgentsMap(threatAgents: Map<String, Couple<ThreatAgentMgm, Fraction>>) {
        this._threatAgentsMap = threatAgents;
    }

    get threatAgentsMap(): Map<String, Couple<ThreatAgentMgm, Fraction>> {
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

    observeRole(): Observable<MyRole> {
        return this.roleSubject.asObservable();
    }

    updateRole(role: MyRole) {
        this.role = role;
        this.roleSubject.next(this.role);
    }

    getRole() {
        return this.role;
    }

    clear() {
        this.mySelfAssessmentSubject.next(null);
        this.layoutUpdateSubject.next(null);
        this.roleSubject.next(null);
    }
}
