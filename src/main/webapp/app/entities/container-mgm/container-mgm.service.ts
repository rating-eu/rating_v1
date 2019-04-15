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

import { ContainerMgm } from './container-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ContainerMgm>;

@Injectable()
export class ContainerMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/containers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/containers';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(container: ContainerMgm): Observable<EntityResponseType> {
        const copy = this.convert(container);
        return this.http.post<ContainerMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(container: ContainerMgm): Observable<EntityResponseType> {
        const copy = this.convert(container);
        return this.http.put<ContainerMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ContainerMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ContainerMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ContainerMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ContainerMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ContainerMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ContainerMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ContainerMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ContainerMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ContainerMgm[]>): HttpResponse<ContainerMgm[]> {
        const jsonResponse: ContainerMgm[] = res.body;
        const body: ContainerMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ContainerMgm.
     */
    private convertItemFromServer(container: ContainerMgm): ContainerMgm {
        const copy: ContainerMgm = Object.assign({}, container);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(container.created);
        return copy;
    }

    /**
     * Convert a ContainerMgm to a JSON which can be sent to the server.
     */
    private convert(container: ContainerMgm): ContainerMgm {
        const copy: ContainerMgm = Object.assign({}, container);

        copy.created = this.dateUtils.toDate(container.created);
        return copy;
    }
}
