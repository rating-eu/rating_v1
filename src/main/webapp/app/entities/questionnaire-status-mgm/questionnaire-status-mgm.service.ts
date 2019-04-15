/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {QuestionnaireStatusMgm} from './questionnaire-status-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<QuestionnaireStatusMgm>;

const SELF_ASSESSMENT_ID_PLACEHOLDER = '{selfAssessmentID}';

const QUESTIONNAIRE_PURPOSE_PLACEHOLDER = '{questionnairePurpose}';

@Injectable()
export class QuestionnaireStatusMgmService {

    private resourceUrl = SERVER_API_URL + 'api/questionnaire-statuses';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/questionnaire-statuses';
    private resourceUrlByRoleSelfAssessmentQuestionnaire = SERVER_API_URL + '';
    private resourceUrlBySelfAssessmentAndQuestionnairePurpose =
        SERVER_API_URL + 'api/questionnaire-statuses/' + SELF_ASSESSMENT_ID_PLACEHOLDER + '/' + QUESTIONNAIRE_PURPOSE_PLACEHOLDER;

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    create(questionnaireStatus: QuestionnaireStatusMgm): Observable<EntityResponseType> {
        const copy = this.convert(questionnaireStatus);
        return this.http.post<QuestionnaireStatusMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(questionnaireStatus: QuestionnaireStatusMgm): Observable<EntityResponseType> {
        const copy = this.convert(questionnaireStatus);
        return this.http.put<QuestionnaireStatusMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionnaireStatusMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionnaireStatusMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<QuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionnaireStatusMgm[]>(this.resourceSearchUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<QuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionnaireStatusMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionnaireStatusMgm[]>): HttpResponse<QuestionnaireStatusMgm[]> {
        const jsonResponse: QuestionnaireStatusMgm[] = res.body;
        const body: QuestionnaireStatusMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionnaireStatusMgm.
     */
    private convertItemFromServer(questionnaireStatus: QuestionnaireStatusMgm): QuestionnaireStatusMgm {
        const copy: QuestionnaireStatusMgm = Object.assign({}, questionnaireStatus);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(questionnaireStatus.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(questionnaireStatus.modified);
        return copy;
    }

    /**
     * Convert a QuestionnaireStatusMgm to a JSON which can be sent to the server.
     */
    private convert(questionnaireStatus: QuestionnaireStatusMgm): QuestionnaireStatusMgm {
        const copy: QuestionnaireStatusMgm = Object.assign({}, questionnaireStatus);

        copy.created = this.dateUtils.toDate(questionnaireStatus.created);

        copy.modified = this.dateUtils.toDate(questionnaireStatus.modified);
        return copy;
    }

    getByRoleSelfAssessmentAndQuestionnaire(role: string, selfAssessmentID: number, questionnaireID: number) {
        return this.http.get<QuestionnaireStatusMgm>(this.resourceUrlByRoleSelfAssessmentQuestionnaire);
    }

    getAllBySelfAssessmentAndQuestionnairePurpose(selfAssessmentID: number, questionnairePurpose: string): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            this.resourceUrlBySelfAssessmentAndQuestionnairePurpose.replace(SELF_ASSESSMENT_ID_PLACEHOLDER, selfAssessmentID + '')
                .replace(QUESTIONNAIRE_PURPOSE_PLACEHOLDER, questionnairePurpose), {observe: 'response'})
            .map((res: HttpResponse<QuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }
}
