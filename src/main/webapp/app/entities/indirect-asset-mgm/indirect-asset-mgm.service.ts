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

import { IndirectAssetMgm } from './indirect-asset-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<IndirectAssetMgm>;

@Injectable()
export class IndirectAssetMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/indirect-assets';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/indirect-assets';

    constructor(private http: HttpClient) { }

    create(indirectAsset: IndirectAssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(indirectAsset);
        return this.http.post<IndirectAssetMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(indirectAsset: IndirectAssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(indirectAsset);
        return this.http.put<IndirectAssetMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IndirectAssetMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<IndirectAssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<IndirectAssetMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<IndirectAssetMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<IndirectAssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<IndirectAssetMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<IndirectAssetMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: IndirectAssetMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<IndirectAssetMgm[]>): HttpResponse<IndirectAssetMgm[]> {
        const jsonResponse: IndirectAssetMgm[] = res.body;
        const body: IndirectAssetMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to IndirectAssetMgm.
     */
    private convertItemFromServer(indirectAsset: IndirectAssetMgm): IndirectAssetMgm {
        const copy: IndirectAssetMgm = Object.assign({}, indirectAsset);
        return copy;
    }

    /**
     * Convert a IndirectAssetMgm to a JSON which can be sent to the server.
     */
    private convert(indirectAsset: IndirectAssetMgm): IndirectAssetMgm {
        const copy: IndirectAssetMgm = Object.assign({}, indirectAsset);
        return copy;
    }
}
