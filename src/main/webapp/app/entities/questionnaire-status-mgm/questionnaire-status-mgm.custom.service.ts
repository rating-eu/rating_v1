import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {QuestionnaireStatusMgm} from './questionnaire-status-mgm.model';
import {Observable} from 'rxjs/Observable';

const RESOURCE_URL = SERVER_API_URL + 'api/questionnaire-statuses';
const SELF_ID = '{selfAssessmentID}';
const QUESTIONNAIRE_ID = '{questionnaireID}';
const ROLE = '{role}';
const BY_ROLE_SELF_QUESTIONNAIRE_URL =
    RESOURCE_URL + '/self-assessment/' + SELF_ID + '/questionnaire/' + QUESTIONNAIRE_ID + '/role/' + ROLE;

@Injectable()
export class QuestionnaireStatusMgmCustomService {

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    getByRoleSelfAssessmentAndQuestionnaire(role: string, selfAssessmentID: number, questionaireID: number): Observable<HttpResponse<QuestionnaireStatusMgm>> {
        return this.http.get<QuestionnaireStatusMgm>(
            BY_ROLE_SELF_QUESTIONNAIRE_URL
                .replace(SELF_ID, String(selfAssessmentID))
                .replace(QUESTIONNAIRE_ID, String(questionaireID))
                .replace(ROLE, role), {observe: 'response'});
    }
}
