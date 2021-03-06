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

import { DirectAssetMgm } from './direct-asset-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<DirectAssetMgm>;

@Injectable()
export class DirectAssetMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/direct-assets';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/direct-assets';

    constructor(private http: HttpClient) { }

    create(directAsset: DirectAssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(directAsset);
        return this.http.post<DirectAssetMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(directAsset: DirectAssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(directAsset);
        return this.http.put<DirectAssetMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DirectAssetMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DirectAssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DirectAssetMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DirectAssetMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<DirectAssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DirectAssetMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DirectAssetMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DirectAssetMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DirectAssetMgm[]>): HttpResponse<DirectAssetMgm[]> {
        const jsonResponse: DirectAssetMgm[] = res.body;
        const body: DirectAssetMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DirectAssetMgm.
     */
    private convertItemFromServer(directAsset: DirectAssetMgm): DirectAssetMgm {
        const copy: DirectAssetMgm = Object.assign({}, directAsset);
        return copy;
    }

    /**
     * Convert a DirectAssetMgm to a JSON which can be sent to the server.
     */
    private convert(directAsset: DirectAssetMgm): DirectAssetMgm {
        const copy: DirectAssetMgm = Object.assign({}, directAsset);
        return copy;
    }
}
