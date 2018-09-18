import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
