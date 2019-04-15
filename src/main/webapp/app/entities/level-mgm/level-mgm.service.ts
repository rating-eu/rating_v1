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

import { LevelMgm } from './level-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LevelMgm>;

@Injectable()
export class LevelMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/levels';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/levels';

    constructor(private http: HttpClient) { }

    create(level: LevelMgm): Observable<EntityResponseType> {
        const copy = this.convert(level);
        return this.http.post<LevelMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(level: LevelMgm): Observable<EntityResponseType> {
        const copy = this.convert(level);
        return this.http.put<LevelMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LevelMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LevelMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<LevelMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LevelMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<LevelMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<LevelMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LevelMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LevelMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LevelMgm[]>): HttpResponse<LevelMgm[]> {
        const jsonResponse: LevelMgm[] = res.body;
        const body: LevelMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LevelMgm.
     */
    private convertItemFromServer(level: LevelMgm): LevelMgm {
        const copy: LevelMgm = Object.assign({}, level);
        return copy;
    }

    /**
     * Convert a LevelMgm to a JSON which can be sent to the server.
     */
    private convert(level: LevelMgm): LevelMgm {
        const copy: LevelMgm = Object.assign({}, level);
        return copy;
    }
}
