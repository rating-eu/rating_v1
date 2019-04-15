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

import { DomainOfInfluenceMgm } from './domain-of-influence-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<DomainOfInfluenceMgm>;

@Injectable()
export class DomainOfInfluenceMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/domain-of-influences';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/domain-of-influences';

    constructor(private http: HttpClient) { }

    create(domainOfInfluence: DomainOfInfluenceMgm): Observable<EntityResponseType> {
        const copy = this.convert(domainOfInfluence);
        return this.http.post<DomainOfInfluenceMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(domainOfInfluence: DomainOfInfluenceMgm): Observable<EntityResponseType> {
        const copy = this.convert(domainOfInfluence);
        return this.http.put<DomainOfInfluenceMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DomainOfInfluenceMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DomainOfInfluenceMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DomainOfInfluenceMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DomainOfInfluenceMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<DomainOfInfluenceMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DomainOfInfluenceMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DomainOfInfluenceMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DomainOfInfluenceMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DomainOfInfluenceMgm[]>): HttpResponse<DomainOfInfluenceMgm[]> {
        const jsonResponse: DomainOfInfluenceMgm[] = res.body;
        const body: DomainOfInfluenceMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DomainOfInfluenceMgm.
     */
    private convertItemFromServer(domainOfInfluence: DomainOfInfluenceMgm): DomainOfInfluenceMgm {
        const copy: DomainOfInfluenceMgm = Object.assign({}, domainOfInfluence);
        return copy;
    }

    /**
     * Convert a DomainOfInfluenceMgm to a JSON which can be sent to the server.
     */
    private convert(domainOfInfluence: DomainOfInfluenceMgm): DomainOfInfluenceMgm {
        const copy: DomainOfInfluenceMgm = Object.assign({}, domainOfInfluence);
        return copy;
    }
}
