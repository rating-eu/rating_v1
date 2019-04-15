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

import { CriticalLevelMgm } from './critical-level-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<CriticalLevelMgm>;

@Injectable()
export class CriticalLevelMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/critical-levels';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/critical-levels';

    constructor(private http: HttpClient) { }

    create(criticalLevel: CriticalLevelMgm): Observable<EntityResponseType> {
        const copy = this.convert(criticalLevel);
        return this.http.post<CriticalLevelMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(criticalLevel: CriticalLevelMgm): Observable<EntityResponseType> {
        const copy = this.convert(criticalLevel);
        return this.http.put<CriticalLevelMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CriticalLevelMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CriticalLevelMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<CriticalLevelMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CriticalLevelMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CriticalLevelMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<CriticalLevelMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CriticalLevelMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CriticalLevelMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CriticalLevelMgm[]>): HttpResponse<CriticalLevelMgm[]> {
        const jsonResponse: CriticalLevelMgm[] = res.body;
        const body: CriticalLevelMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CriticalLevelMgm.
     */
    private convertItemFromServer(criticalLevel: CriticalLevelMgm): CriticalLevelMgm {
        const copy: CriticalLevelMgm = Object.assign({}, criticalLevel);
        return copy;
    }

    /**
     * Convert a CriticalLevelMgm to a JSON which can be sent to the server.
     */
    private convert(criticalLevel: CriticalLevelMgm): CriticalLevelMgm {
        const copy: CriticalLevelMgm = Object.assign({}, criticalLevel);
        return copy;
    }
}
