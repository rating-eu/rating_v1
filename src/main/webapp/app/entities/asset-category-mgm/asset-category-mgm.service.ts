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

import {AssetCategoryMgm} from './asset-category-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<AssetCategoryMgm>;

@Injectable()
export class AssetCategoryMgmService {

    private resourceUrl = SERVER_API_URL + 'api/asset-categories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/asset-categories';

    constructor(private http: HttpClient) {
    }

    create(assetCategory: AssetCategoryMgm): Observable<EntityResponseType> {
        const copy = this.convert(assetCategory);
        return this.http.post<AssetCategoryMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(assetCategory: AssetCategoryMgm): Observable<EntityResponseType> {
        const copy = this.convert(assetCategory);
        return this.http.put<AssetCategoryMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<AssetCategoryMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    findAll(): Observable<HttpResponse<AssetCategoryMgm[]>> {
        return this.http.get<AssetCategoryMgm[]>(this.resourceUrl, {observe: 'response'})
            .map((res: HttpResponse<AssetCategoryMgm[]>) => this.convertArrayResponse(res));
    }

    query(req?: any): Observable<HttpResponse<AssetCategoryMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AssetCategoryMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<AssetCategoryMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<AssetCategoryMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AssetCategoryMgm[]>(this.resourceSearchUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<AssetCategoryMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: AssetCategoryMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<AssetCategoryMgm[]>): HttpResponse<AssetCategoryMgm[]> {
        const jsonResponse: AssetCategoryMgm[] = res.body;
        const body: AssetCategoryMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to AssetCategoryMgm.
     */
    private convertItemFromServer(assetCategory: AssetCategoryMgm): AssetCategoryMgm {
        const copy: AssetCategoryMgm = Object.assign({}, assetCategory);
        return copy;
    }

    /**
     * Convert a AssetCategoryMgm to a JSON which can be sent to the server.
     */
    private convert(assetCategory: AssetCategoryMgm): AssetCategoryMgm {
        const copy: AssetCategoryMgm = Object.assign({}, assetCategory);
        return copy;
    }
}
