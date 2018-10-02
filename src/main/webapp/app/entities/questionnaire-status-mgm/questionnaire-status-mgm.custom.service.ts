import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {QuestionnaireStatusMgm} from './questionnaire-status-mgm.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class QuestionnaireStatusMgmCustomService {

    private selfAssessmentID = '{selfAssessmentID}';
    private questionnaireID = '{questionnaireID}';
    private role = '{role}';

    private resourceUrl = SERVER_API_URL + 'api/questionnaire-statuses';
    private byRoleSelfAssessmentAndQuestionnaireUrl =
        this.resourceUrl + '/self-assessment/' + this.selfAssessmentID + '/questionnaire/' + this.questionnaireID + '/role/' + this.role;

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    getByRoleSelfAssessmentAndQuestionnaire(role: string, selfAssessmentID: number, questionaireID: number): Observable<HttpResponse<QuestionnaireStatusMgm>> {
        return this.http.get<QuestionnaireStatusMgm>(
            this.byRoleSelfAssessmentAndQuestionnaireUrl
                .replace(this.selfAssessmentID, String(selfAssessmentID))
                .replace(this.questionnaireID, String(questionaireID))
                .replace(this.role, role), {observe: 'response'});
    }
}
