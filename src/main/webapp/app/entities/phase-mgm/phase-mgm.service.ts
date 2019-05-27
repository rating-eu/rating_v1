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

import { PhaseMgm } from './phase-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<PhaseMgm>;

@Injectable()
export class PhaseMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/phases';

    constructor(private http: HttpClient) { }

    create(phase: PhaseMgm): Observable<EntityResponseType> {
        const copy = this.convert(phase);
        return this.http.post<PhaseMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(phase: PhaseMgm): Observable<EntityResponseType> {
        const copy = this.convert(phase);
        return this.http.put<PhaseMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PhaseMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<PhaseMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<PhaseMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PhaseMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PhaseMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PhaseMgm[]>): HttpResponse<PhaseMgm[]> {
        const jsonResponse: PhaseMgm[] = res.body;
        const body: PhaseMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to PhaseMgm.
     */
    private convertItemFromServer(phase: PhaseMgm): PhaseMgm {
        const copy: PhaseMgm = Object.assign({}, phase);
        return copy;
    }

    /**
     * Convert a PhaseMgm to a JSON which can be sent to the server.
     */
    private convert(phase: PhaseMgm): PhaseMgm {
        const copy: PhaseMgm = Object.assign({}, phase);
        return copy;
    }
}
