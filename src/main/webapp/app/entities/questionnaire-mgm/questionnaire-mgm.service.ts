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

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { QuestionnaireMgm } from './questionnaire-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<QuestionnaireMgm>;

@Injectable()
export class QuestionnaireMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/questionnaires';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/questionnaires';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(questionnaire: QuestionnaireMgm): Observable<EntityResponseType> {
        const copy = this.convert(questionnaire);
        return this.http.post<QuestionnaireMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(questionnaire: QuestionnaireMgm): Observable<EntityResponseType> {
        const copy = this.convert(questionnaire);
        return this.http.put<QuestionnaireMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionnaireMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionnaireMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionnaireMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionnaireMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<QuestionnaireMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionnaireMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionnaireMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionnaireMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionnaireMgm[]>): HttpResponse<QuestionnaireMgm[]> {
        const jsonResponse: QuestionnaireMgm[] = res.body;
        const body: QuestionnaireMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionnaireMgm.
     */
    private convertItemFromServer(questionnaire: QuestionnaireMgm): QuestionnaireMgm {
        const copy: QuestionnaireMgm = Object.assign({}, questionnaire);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(questionnaire.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(questionnaire.modified);
        return copy;
    }

    /**
     * Convert a QuestionnaireMgm to a JSON which can be sent to the server.
     */
    private convert(questionnaire: QuestionnaireMgm): QuestionnaireMgm {
        const copy: QuestionnaireMgm = Object.assign({}, questionnaire);

        copy.created = this.dateUtils.toDate(questionnaire.created);

        copy.modified = this.dateUtils.toDate(questionnaire.modified);
        return copy;
    }
}
