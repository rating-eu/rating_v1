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

import {MyAnswerMgm} from './my-answer-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<MyAnswerMgm>;

@Injectable()
export class MyAnswerMgmService {
    private resourceUrl = SERVER_API_URL + 'api/my-answers';

    constructor(private http: HttpClient) {
    }

    create(myAnswer: MyAnswerMgm): Observable<EntityResponseType> {
        const copy = this.convert(myAnswer);
        return this.http.post<MyAnswerMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(myAnswer: MyAnswerMgm): Observable<EntityResponseType> {
        const copy = this.convert(myAnswer);
        return this.http.put<MyAnswerMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    getAllByQuestionnaireStatusID(questionnaireStatusID: number): Observable<HttpResponse<MyAnswerMgm[]>> {
        const options = createRequestOption();
        return this.http.get<MyAnswerMgm[]>(
            this.resourceUrl + '/questionnaire-status/' + questionnaireStatusID,
            {params: options, observe: 'response'})
            .map((res: HttpResponse<MyAnswerMgm[]>) => this.convertArrayResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MyAnswerMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<MyAnswerMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyAnswerMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<MyAnswerMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MyAnswerMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MyAnswerMgm[]>): HttpResponse<MyAnswerMgm[]> {
        const jsonResponse: MyAnswerMgm[] = res.body;
        const body: MyAnswerMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to MyAnswerMgm.
     */
    private convertItemFromServer(myAnswer: MyAnswerMgm): MyAnswerMgm {
        const copy: MyAnswerMgm = Object.assign({}, myAnswer);
        return copy;
    }

    /**
     * Convert a MyAnswerMgm to a JSON which can be sent to the server.
     */
    private convert(myAnswer: MyAnswerMgm): MyAnswerMgm {
        const copy: MyAnswerMgm = Object.assign({}, myAnswer);
        return copy;
    }

    private convertArray(myAnswers: MyAnswerMgm[]): MyAnswerMgm[] {
        const copy: MyAnswerMgm[] = Object.assign([], myAnswers);
        return copy;
    }
}
