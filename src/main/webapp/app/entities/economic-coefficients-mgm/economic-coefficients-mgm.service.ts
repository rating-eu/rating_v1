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

import { EconomicCoefficientsMgm } from './economic-coefficients-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<EconomicCoefficientsMgm>;

@Injectable()
export class EconomicCoefficientsMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/economic-coefficients';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/economic-coefficients';

    constructor(private http: HttpClient) { }

    create(economicCoefficients: EconomicCoefficientsMgm): Observable<EntityResponseType> {
        const copy = this.convert(economicCoefficients);
        return this.http.post<EconomicCoefficientsMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(economicCoefficients: EconomicCoefficientsMgm): Observable<EntityResponseType> {
        const copy = this.convert(economicCoefficients);
        return this.http.put<EconomicCoefficientsMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<EconomicCoefficientsMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<EconomicCoefficientsMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<EconomicCoefficientsMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<EconomicCoefficientsMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<EconomicCoefficientsMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<EconomicCoefficientsMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<EconomicCoefficientsMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: EconomicCoefficientsMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<EconomicCoefficientsMgm[]>): HttpResponse<EconomicCoefficientsMgm[]> {
        const jsonResponse: EconomicCoefficientsMgm[] = res.body;
        const body: EconomicCoefficientsMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to EconomicCoefficientsMgm.
     */
    private convertItemFromServer(economicCoefficients: EconomicCoefficientsMgm): EconomicCoefficientsMgm {
        const copy: EconomicCoefficientsMgm = Object.assign({}, economicCoefficients);
        return copy;
    }

    /**
     * Convert a EconomicCoefficientsMgm to a JSON which can be sent to the server.
     */
    private convert(economicCoefficients: EconomicCoefficientsMgm): EconomicCoefficientsMgm {
        const copy: EconomicCoefficientsMgm = Object.assign({}, economicCoefficients);
        return copy;
    }
}
