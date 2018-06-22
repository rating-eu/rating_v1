import {Injectable} from '@angular/core';
import {SERVER_API_URL} from '../app.constants';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {MotivationMgm} from '../entities/motivation-mgm';
import {QuestionnaireMgm} from '../entities/questionnaire-mgm';
import {ThreatAgentMgm} from '../entities/threat-agent-mgm';
import {QuestionnaireStatusMgm} from '../entities/questionnaire-status-mgm';
import {Router} from '@angular/router';

@Injectable()
export class IdentifyThreatAgentService {

    constructor(private http: HttpClient, private router: Router) {
    }

    showThreatAgentsResult(questionnaireStatus: QuestionnaireStatusMgm) {
        console.log('IdentifyThreatAgents QuestionnaireStatus: ' + JSON.stringify(questionnaireStatus));
        this.router.navigate(['/identify-threat-agent/result', questionnaireStatus.id]);
    }
}
