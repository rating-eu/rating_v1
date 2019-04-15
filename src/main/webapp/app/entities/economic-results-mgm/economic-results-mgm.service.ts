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

import { EconomicResultsMgm } from './economic-results-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<EconomicResultsMgm>;

@Injectable()
export class EconomicResultsMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/economic-results';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/economic-results';

    constructor(private http: HttpClient) { }

    create(economicResults: EconomicResultsMgm): Observable<EntityResponseType> {
        const copy = this.convert(economicResults);
        return this.http.post<EconomicResultsMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(economicResults: EconomicResultsMgm): Observable<EntityResponseType> {
        const copy = this.convert(economicResults);
        return this.http.put<EconomicResultsMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<EconomicResultsMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<EconomicResultsMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<EconomicResultsMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<EconomicResultsMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<EconomicResultsMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<EconomicResultsMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<EconomicResultsMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: EconomicResultsMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<EconomicResultsMgm[]>): HttpResponse<EconomicResultsMgm[]> {
        const jsonResponse: EconomicResultsMgm[] = res.body;
        const body: EconomicResultsMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to EconomicResultsMgm.
     */
    private convertItemFromServer(economicResults: EconomicResultsMgm): EconomicResultsMgm {
        const copy: EconomicResultsMgm = Object.assign({}, economicResults);
        return copy;
    }

    /**
     * Convert a EconomicResultsMgm to a JSON which can be sent to the server.
     */
    private convert(economicResults: EconomicResultsMgm): EconomicResultsMgm {
        const copy: EconomicResultsMgm = Object.assign({}, economicResults);
        return copy;
    }
}
