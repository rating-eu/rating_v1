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

import { EBITMgm } from './ebit-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<EBITMgm>;

@Injectable()
export class EBITMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/ebits';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(eBIT: EBITMgm): Observable<EntityResponseType> {
        const copy = this.convert(eBIT);
        return this.http.post<EBITMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(eBIT: EBITMgm): Observable<EntityResponseType> {
        const copy = this.convert(eBIT);
        return this.http.put<EBITMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<EBITMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<EBITMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<EBITMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<EBITMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: EBITMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<EBITMgm[]>): HttpResponse<EBITMgm[]> {
        const jsonResponse: EBITMgm[] = res.body;
        const body: EBITMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to EBITMgm.
     */
    private convertItemFromServer(eBIT: EBITMgm): EBITMgm {
        const copy: EBITMgm = Object.assign({}, eBIT);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(eBIT.created);
        return copy;
    }

    /**
     * Convert a EBITMgm to a JSON which can be sent to the server.
     */
    private convert(eBIT: EBITMgm): EBITMgm {
        const copy: EBITMgm = Object.assign({}, eBIT);

        copy.created = this.dateUtils.toDate(eBIT.created);
        return copy;
    }
}
