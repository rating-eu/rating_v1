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
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import {JhiDateUtils} from 'ng-jhipster';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {QuestionnaireMgm} from '../entities/questionnaire-mgm';
import {QuestionnairePurpose} from '../entities/enumerations/QuestionnairePurpose.enum';
import {QuestionMgm} from '../entities/question-mgm';
import {User} from '../shared';
import {MyAnswerMgm} from '../entities/my-answer-mgm';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {QuestionnaireStatusMgm} from '../entities/questionnaire-status-mgm';
import {CompanyProfileMgm} from "../entities/company-profile-mgm";
import {CompanyType} from "../entities/enumerations/CompanyType.enum";

const PURPOSE_PLACEHOLDER = '{purpose}';
const COMPANY_TYPE_PLACEHOLDER = '{company-type}';

@Injectable()
export class QuestionnairesService {

    private questionnaireByPurposeAndCompanyTypeAPIUrl = SERVER_API_URL + 'api/questionnaires/by/purpose/' + PURPOSE_PLACEHOLDER + '/company-type/' + COMPANY_TYPE_PLACEHOLDER;
    private questionnaireStatusesByCompanyProfileQuestionnairePurposeAndUser = SERVER_API_URL + 'api/questionnaire-statuses/company-profile/{companyProfileID}/purpose/{questionnairePurpose}/user/{userID}';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    getQuestionnaireByPurposeAndCompanyType(purpose: QuestionnairePurpose, companyType: CompanyType): Observable<QuestionnaireMgm> {
        return this.http.get<QuestionnaireMgm>(this.questionnaireByPurposeAndCompanyTypeAPIUrl
            .replace(PURPOSE_PLACEHOLDER, QuestionnairePurpose[purpose])
            .replace(COMPANY_TYPE_PLACEHOLDER, CompanyType[companyType])
        );
    }

    getQuestionnaireStatusesByCompanyProfileQuestionnairePurposeAndUser(companyProfile: CompanyProfileMgm, questionnairePurpose: QuestionnairePurpose, user: User): Observable<QuestionnaireStatusMgm[]> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            this.questionnaireStatusesByCompanyProfileQuestionnairePurposeAndUser.replace('{companyProfileID}', String(companyProfile.id)).replace("{questionnairePurpose}", String(questionnairePurpose)).replace('{userID}', user.id));
    }
}
