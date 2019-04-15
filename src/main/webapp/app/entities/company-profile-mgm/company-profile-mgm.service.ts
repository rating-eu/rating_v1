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

import { CompanyProfileMgm } from './company-profile-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<CompanyProfileMgm>;

@Injectable()
export class CompanyProfileMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/company-profiles';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/company-profiles';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(companyProfile: CompanyProfileMgm): Observable<EntityResponseType> {
        const copy = this.convert(companyProfile);
        return this.http.post<CompanyProfileMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(companyProfile: CompanyProfileMgm): Observable<EntityResponseType> {
        const copy = this.convert(companyProfile);
        return this.http.put<CompanyProfileMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CompanyProfileMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CompanyProfileMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<CompanyProfileMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CompanyProfileMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CompanyProfileMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<CompanyProfileMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CompanyProfileMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CompanyProfileMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CompanyProfileMgm[]>): HttpResponse<CompanyProfileMgm[]> {
        const jsonResponse: CompanyProfileMgm[] = res.body;
        const body: CompanyProfileMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CompanyProfileMgm.
     */
    private convertItemFromServer(companyProfile: CompanyProfileMgm): CompanyProfileMgm {
        const copy: CompanyProfileMgm = Object.assign({}, companyProfile);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(companyProfile.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(companyProfile.modified);
        return copy;
    }

    /**
     * Convert a CompanyProfileMgm to a JSON which can be sent to the server.
     */
    private convert(companyProfile: CompanyProfileMgm): CompanyProfileMgm {
        const copy: CompanyProfileMgm = Object.assign({}, companyProfile);

        copy.created = this.dateUtils.toDate(companyProfile.created);

        copy.modified = this.dateUtils.toDate(companyProfile.modified);
        return copy;
    }
}
