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

import {MyCompanyMgm} from './my-company-mgm.model';
import {createRequestOption} from '../../shared';
import {E} from '@angular/core/src/render3';

export type EntityResponseType = HttpResponse<MyCompanyMgm>;

@Injectable()
export class MyCompanyMgmService {

    private resourceUrl = SERVER_API_URL + 'api/my-companies';
    private resourceUrlByUser = SERVER_API_URL + 'api/my-companies/by-user'/*/{userId}*/;
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/my-companies';

    constructor(private http: HttpClient) {
    }

    create(myCompany: MyCompanyMgm): Observable<EntityResponseType> {
        const copy = this.convert(myCompany);
        return this.http.post<MyCompanyMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(myCompany: MyCompanyMgm): Observable<EntityResponseType> {
        const copy = this.convert(myCompany);
        return this.http.put<MyCompanyMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MyCompanyMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    findByUser(userID: number): Observable<EntityResponseType> {
        return this.http.get<MyCompanyMgm>(`${this.resourceUrlByUser}/${userID}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<MyCompanyMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyCompanyMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<MyCompanyMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MyCompanyMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MyCompanyMgm[]>): HttpResponse<MyCompanyMgm[]> {
        const jsonResponse: MyCompanyMgm[] = res.body;
        const body: MyCompanyMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to MyCompanyMgm.
     */
    private convertItemFromServer(myCompany: MyCompanyMgm): MyCompanyMgm {
        const copy: MyCompanyMgm = Object.assign({}, myCompany);
        return copy;
    }

    /**
     * Convert a MyCompanyMgm to a JSON which can be sent to the server.
     */
    private convert(myCompany: MyCompanyMgm): MyCompanyMgm {
        const copy: MyCompanyMgm = Object.assign({}, myCompany);
        return copy;
    }
}
