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
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {AugmentedAttackStrategy} from './models/augmented-attack-strategy.model';
import {Observable} from 'rxjs/Observable';
import {CompanyProfileMgm} from "../entities/company-profile-mgm";

const COMPANY_PROFILE_ID_PLACEHOLDER = '{selfAssessmentID}';

@Injectable()
export class AttackMapService {
    private resourceUrl = SERVER_API_URL + 'api/' + COMPANY_PROFILE_ID_PLACEHOLDER + '/attack-matrix';

    constructor(private http: HttpClient) {
    }

    getAttackCKC7Matrix(companyProfile: CompanyProfileMgm): Observable<Map<Number/*Level.ID*/, Map<Number/*Phase.ID*/, AugmentedAttackStrategy>>> {
        return this.http.get<Map<Number, Map<Number, AugmentedAttackStrategy>>>(this.resourceUrl.replace(COMPANY_PROFILE_ID_PLACEHOLDER, String(companyProfile.id)));
    }
}
