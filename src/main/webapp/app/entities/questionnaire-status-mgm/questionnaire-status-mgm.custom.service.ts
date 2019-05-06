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
import {SERVER_API_URL} from '../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {QuestionnaireStatusMgm} from './questionnaire-status-mgm.model';
import {Observable} from 'rxjs/Observable';

const RESOURCE_URL = SERVER_API_URL + 'api/questionnaire-statuses';
const COMPANY_PROFILE_ID = '{companyProfileID}';
const QUESTIONNAIRE_ID = '{questionnaireID}';
const ROLE = '{role}';
const BY_ROLE_SELF_QUESTIONNAIRE_URL =
    RESOURCE_URL + '/company-profile/' + COMPANY_PROFILE_ID + '/questionnaire/' + QUESTIONNAIRE_ID + '/role/' + ROLE;

@Injectable()
export class QuestionnaireStatusMgmCustomService {

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    getByRoleCompanyProfileAndQuestionnaire(role: string, companyProfileID: number, questionaireID: number): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            BY_ROLE_SELF_QUESTIONNAIRE_URL
                .replace(COMPANY_PROFILE_ID, String(companyProfileID))
                .replace(QUESTIONNAIRE_ID, String(questionaireID))
                .replace(ROLE, role), {observe: 'response'});
    }
}
