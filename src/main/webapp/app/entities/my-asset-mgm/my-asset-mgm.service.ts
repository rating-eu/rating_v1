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

import {MyAssetMgm} from './my-asset-mgm.model';
import {createRequestOption} from '../../shared';
import {AssetCategoryMgm} from "../asset-category-mgm";
import {SelfAssessmentMgm} from "../self-assessment-mgm";

export type EntityResponseType = HttpResponse<MyAssetMgm>;

const SELF_ASSESSMENT_ID_PLACEHOLDER = "{selfAssessmentID}";

const CATEGORY_PLACEHOLDER = "{category}";

@Injectable()
export class MyAssetMgmService {

    private resourceUrl = SERVER_API_URL + 'api/my-assets';
    private myAssetsBySelfAndCategory = this.resourceUrl + "/self-assessment/" + SELF_ASSESSMENT_ID_PLACEHOLDER + "/category/" + CATEGORY_PLACEHOLDER;
    private createMyAssetsUrl = SERVER_API_URL + 'api/' + SELF_ASSESSMENT_ID_PLACEHOLDER + '/my-assets/all';

    private resourceSearchUrl = SERVER_API_URL + 'api/_search/my-assets';

    constructor(private http: HttpClient) {
    }

    create(myAsset: MyAssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(myAsset);
        return this.http.post<MyAssetMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(myAsset: MyAssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(myAsset);
        return this.http.put<MyAssetMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MyAssetMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<MyAssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyAssetMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<MyAssetMgm[]>) => this.convertArrayResponse(res));
    }

    getAllBySelfAssessmentAndAssetCategory(selfAssessmentID: number, assetCategory: AssetCategoryMgm): Observable<HttpResponse<MyAssetMgm[]>> {
        return this.http.get<MyAssetMgm[]>(this.myAssetsBySelfAndCategory
                .replace(SELF_ASSESSMENT_ID_PLACEHOLDER, String(selfAssessmentID))
                .replace(CATEGORY_PLACEHOLDER, assetCategory.name),
            {observe: 'response'}
        ).map((res: HttpResponse<MyAssetMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<MyAssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyAssetMgm[]>(this.resourceSearchUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<MyAssetMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MyAssetMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MyAssetMgm[]>): HttpResponse<MyAssetMgm[]> {
        const jsonResponse: MyAssetMgm[] = res.body;
        const body: MyAssetMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to MyAssetMgm.
     */
    private convertItemFromServer(myAsset: MyAssetMgm): MyAssetMgm {
        const copy: MyAssetMgm = Object.assign({}, myAsset);
        return copy;
    }

    /**
     * Convert a MyAssetMgm to a JSON which can be sent to the server.
     */
    private convert(myAsset: MyAssetMgm): MyAssetMgm {
        const copy: MyAssetMgm = Object.assign({}, myAsset);
        return copy;
    }

    public saveMyAssets(self: SelfAssessmentMgm, myAssets: MyAssetMgm[]): Observable<HttpResponse<MyAssetMgm[]>> {
        const url = this.createMyAssetsUrl.replace(SELF_ASSESSMENT_ID_PLACEHOLDER, String(self.id));

        return this.http.post<MyAssetMgm[]>(url, myAssets, {observe: 'response'})
            .map((res: HttpResponse<MyAssetMgm[]>) => this.convertArrayResponse(res));
    }
}
