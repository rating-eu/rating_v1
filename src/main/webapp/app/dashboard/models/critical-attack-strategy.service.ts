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
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CriticalAttackStrategy} from './critical-attack-strategy.model';

@Injectable()
export class CriticalAttackStrategyService {
    private selfAssessmentIDPlaceholder = '{selfAssessmentID}';
    private criticalAttackStrategiesURL = SERVER_API_URL + 'api/' + this.selfAssessmentIDPlaceholder + '/critical-attack-strategies';

    constructor(
        private http: HttpClient
    ) {
    }

    public getCriticalAttackStrategies(selfAssessmentID: number): Observable<CriticalAttackStrategy[]> {
        return this.http.get<CriticalAttackStrategy[]>(
            this.criticalAttackStrategiesURL
                .replace(this.selfAssessmentIDPlaceholder, String(selfAssessmentID))
        );
    }
}
