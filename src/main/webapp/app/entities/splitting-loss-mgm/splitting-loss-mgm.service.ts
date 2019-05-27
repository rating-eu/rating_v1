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

import { SplittingLossMgm } from './splitting-loss-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SplittingLossMgm>;

@Injectable()
export class SplittingLossMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/splitting-losses';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/splitting-losses';

    constructor(private http: HttpClient) { }

    create(splittingLoss: SplittingLossMgm): Observable<EntityResponseType> {
        const copy = this.convert(splittingLoss);
        return this.http.post<SplittingLossMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(splittingLoss: SplittingLossMgm): Observable<EntityResponseType> {
        const copy = this.convert(splittingLoss);
        return this.http.put<SplittingLossMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SplittingLossMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SplittingLossMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<SplittingLossMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SplittingLossMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SplittingLossMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SplittingLossMgm[]>): HttpResponse<SplittingLossMgm[]> {
        const jsonResponse: SplittingLossMgm[] = res.body;
        const body: SplittingLossMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SplittingLossMgm.
     */
    private convertItemFromServer(splittingLoss: SplittingLossMgm): SplittingLossMgm {
        const copy: SplittingLossMgm = Object.assign({}, splittingLoss);
        return copy;
    }

    /**
     * Convert a SplittingLossMgm to a JSON which can be sent to the server.
     */
    private convert(splittingLoss: SplittingLossMgm): SplittingLossMgm {
        const copy: SplittingLossMgm = Object.assign({}, splittingLoss);
        return copy;
    }
}
