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

import { LikelihoodScaleMgm } from './likelihood-scale-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LikelihoodScaleMgm>;

@Injectable()
export class LikelihoodScaleMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/likelihood-scales';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/likelihood-scales';

    constructor(private http: HttpClient) { }

    create(likelihoodScale: LikelihoodScaleMgm): Observable<EntityResponseType> {
        const copy = this.convert(likelihoodScale);
        return this.http.post<LikelihoodScaleMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(likelihoodScale: LikelihoodScaleMgm): Observable<EntityResponseType> {
        const copy = this.convert(likelihoodScale);
        return this.http.put<LikelihoodScaleMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LikelihoodScaleMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LikelihoodScaleMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<LikelihoodScaleMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LikelihoodScaleMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LikelihoodScaleMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LikelihoodScaleMgm[]>): HttpResponse<LikelihoodScaleMgm[]> {
        const jsonResponse: LikelihoodScaleMgm[] = res.body;
        const body: LikelihoodScaleMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LikelihoodScaleMgm.
     */
    private convertItemFromServer(likelihoodScale: LikelihoodScaleMgm): LikelihoodScaleMgm {
        const copy: LikelihoodScaleMgm = Object.assign({}, likelihoodScale);
        return copy;
    }

    /**
     * Convert a LikelihoodScaleMgm to a JSON which can be sent to the server.
     */
    private convert(likelihoodScale: LikelihoodScaleMgm): LikelihoodScaleMgm {
        const copy: LikelihoodScaleMgm = Object.assign({}, likelihoodScale);
        return copy;
    }
}
