import {Injectable} from '@angular/core';
import {Fraction} from '../utils/fraction.class';
import {Couple} from '../utils/couple.class';
import {ThreatAgentMgm} from '../entities/threat-agent-mgm';
import {AnswerMgm} from '../entities/answer-mgm';
import {QuestionMgm} from '../entities/question-mgm';
import {QuestionnaireStatusMgm} from '../entities/questionnaire-status-mgm';

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
}
