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

import { AnswerMgm } from './answer-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<AnswerMgm>;

@Injectable()
export class AnswerMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/answers';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(answer: AnswerMgm): Observable<EntityResponseType> {
        const copy = this.convert(answer);
        return this.http.post<AnswerMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(answer: AnswerMgm): Observable<EntityResponseType> {
        const copy = this.convert(answer);
        return this.http.put<AnswerMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<AnswerMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<AnswerMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AnswerMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AnswerMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: AnswerMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<AnswerMgm[]>): HttpResponse<AnswerMgm[]> {
        const jsonResponse: AnswerMgm[] = res.body;
        const body: AnswerMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to AnswerMgm.
     */
    private convertItemFromServer(answer: AnswerMgm): AnswerMgm {
        const copy: AnswerMgm = Object.assign({}, answer);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(answer.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(answer.modified);
        return copy;
    }

    /**
     * Convert a AnswerMgm to a JSON which can be sent to the server.
     */
    private convert(answer: AnswerMgm): AnswerMgm {
        const copy: AnswerMgm = Object.assign({}, answer);

        copy.created = this.dateUtils.toDate(answer.created);

        copy.modified = this.dateUtils.toDate(answer.modified);
        return copy;
    }
}
