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
import {SERVER_API_URL} from '../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Result} from './models/result.model';
import {Observable} from 'rxjs/Observable';

export type EntityResponseType = HttpResponse<Result>;

@Injectable()
export class ResultsService {
    private resourceUrl = SERVER_API_URL + 'api/result';
    private maxLikelihoodUrl = SERVER_API_URL + 'api/likelihood/max';

    constructor(
        private http: HttpClient
    ) {
    }

    getResult(companyProfileID: number): Observable<EntityResponseType> {
        return this.http.get<Result>(this.resourceUrl + '/' + companyProfileID, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    getMax(): Observable<number> {
        return this.http.get<number>(this.maxLikelihoodUrl, {observe: 'response'})
            .map((res: HttpResponse<number>) => {
                return res.body;
            });
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Result = res.body;

        // Initial Vulnerability Map
        const initialVulnerabilityMap: Map<number, number> = new Map<number, number>();

        Object.keys(body.initialVulnerability)
            .forEach((key: string) => {
                initialVulnerabilityMap.set(Number(key), body.initialVulnerability[key] as number);
            });

        body.initialVulnerability = initialVulnerabilityMap;

        // Contextual Vulnerability Map
        const contextualVulnerabilityMap: Map<number, number> = new Map<number, number>();

        Object.keys(body.contextualVulnerability)
            .forEach((key: string) => {
                contextualVulnerabilityMap.set(Number(key), body.contextualVulnerability[key] as number);
            });

        body.contextualVulnerability = contextualVulnerabilityMap;

        // RefinedVulnerability Map
        const refinedVulnerabilityMap: Map<number, number> = new Map<number, number>();

        Object.keys(body.refinedVulnerability)
            .forEach((key: string) => {
                refinedVulnerabilityMap.set(Number(key), body.refinedVulnerability[key] as number);
            });

        body.refinedVulnerability = refinedVulnerabilityMap;

        return res.clone({body});
    }
}
