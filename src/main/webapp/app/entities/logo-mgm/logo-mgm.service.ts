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

import {LogoMgm} from './logo-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<LogoMgm>;

@Injectable()
export class LogoMgmService {

    private resourceUrl = SERVER_API_URL + 'api/logos';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/logos';

    constructor(private http: HttpClient) {
    }

    create(logo: LogoMgm): Observable<EntityResponseType> {
        const copy = this.convert(logo);
        return this.http.post<LogoMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(logo: LogoMgm): Observable<EntityResponseType> {
        const copy = this.convert(logo);
        return this.http.put<LogoMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LogoMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    getSecondaryLogo(): Observable<EntityResponseType> {
        const secondary = 'secondary';
        return this.http.get<LogoMgm>(`${this.resourceUrl}/${secondary}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LogoMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<LogoMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<LogoMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<LogoMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<LogoMgm[]>(this.resourceSearchUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<LogoMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LogoMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LogoMgm[]>): HttpResponse<LogoMgm[]> {
        const jsonResponse: LogoMgm[] = res.body;
        const body: LogoMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LogoMgm.
     */
    private convertItemFromServer(logo: LogoMgm): LogoMgm {
        const copy: LogoMgm = Object.assign({}, logo);
        return copy;
    }

    /**
     * Convert a LogoMgm to a JSON which can be sent to the server.
     */
    private convert(logo: LogoMgm): LogoMgm {
        const copy: LogoMgm = Object.assign({}, logo);
        return copy;
    }
}
