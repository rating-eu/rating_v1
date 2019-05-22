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

import {JhiDateUtils} from 'ng-jhipster';

import {QuestionnaireStatusMgm} from './questionnaire-status-mgm.model';
import {createRequestOption, User} from '../../shared';
import {CompanyProfileMgm} from "../company-profile-mgm";
import {QuestionnairePurpose} from "../enumerations/QuestionnairePurpose.enum";
import {QuestionMgm} from "../question-mgm";
import {Role} from "../enumerations/Role.enum";

export type EntityResponseType = HttpResponse<QuestionnaireStatusMgm>;

const QUESTIONNAIRE_PURPOSE_PLACEHOLDER = '{questionnairePurpose}';

const COMPANY_ID_PLACEHOLDER = '{companyProfileID}';

const QUESTIONNAIRE_ID_PLACEHOLDER = '{questionnaireID}';

const ROLE_PLACEHOLDER = '{role}';

const USER_ID_PLACEHOLDER = '{userID}';

@Injectable()
export class QuestionnaireStatusMgmService {

    private resourceUrl = SERVER_API_URL + 'api/questionnaire-statuses';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/questionnaire-statuses';

    private questionnaireStatusesByCompanyProfile = this.resourceUrl + '/company-profile/' + COMPANY_ID_PLACEHOLDER;

    private questionnaireStatusesByCompanyProfileAndUser = this.resourceUrl + '/company-profile/' + COMPANY_ID_PLACEHOLDER + '/user/' + USER_ID_PLACEHOLDER;

    private questionnaireStatusesByCompanyProfileAndQuestionnairePurpose = this.resourceUrl + '/company-profile/' + COMPANY_ID_PLACEHOLDER + '/purpose/' + QUESTIONNAIRE_PURPOSE_PLACEHOLDER;

    private questionnaireStatusesByCompanyProfileQuestionnaireAndRole = this.resourceUrl + '/company-profile/' + COMPANY_ID_PLACEHOLDER + '/questionnaire/' + QUESTIONNAIRE_ID_PLACEHOLDER + '/role/' + ROLE_PLACEHOLDER;

    private questionnaireStatusesByCompanyProfileQuestionnairePurposeAndUser = this.resourceUrl + '/company-profile/' + COMPANY_ID_PLACEHOLDER + '/purpose/' + QUESTIONNAIRE_PURPOSE_PLACEHOLDER + '/user/' + USER_ID_PLACEHOLDER;
    private questionnaireStatusesByCurrentUserAndQuestionnairePurpose = this.resourceUrl + '/me/purpose/' + QUESTIONNAIRE_PURPOSE_PLACEHOLDER;

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    create(questionnaireStatus: QuestionnaireStatusMgm): Observable<EntityResponseType> {
        const copy = this.convert(questionnaireStatus);
        return this.http.post<QuestionnaireStatusMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(questionnaireStatus: QuestionnaireStatusMgm): Observable<EntityResponseType> {
        const copy = this.convert(questionnaireStatus);
        return this.http.put<QuestionnaireStatusMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionnaireStatusMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionnaireStatusMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<QuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionnaireStatusMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionnaireStatusMgm[]>): HttpResponse<QuestionnaireStatusMgm[]> {
        const jsonResponse: QuestionnaireStatusMgm[] = res.body;
        const body: QuestionnaireStatusMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionnaireStatusMgm.
     */
    private convertItemFromServer(questionnaireStatus: QuestionnaireStatusMgm): QuestionnaireStatusMgm {
        const copy: QuestionnaireStatusMgm = Object.assign({}, questionnaireStatus);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(questionnaireStatus.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(questionnaireStatus.modified);
        return copy;
    }

    /**
     * Convert a QuestionnaireStatusMgm to a JSON which can be sent to the server.
     */
    private convert(questionnaireStatus: QuestionnaireStatusMgm): QuestionnaireStatusMgm {
        const copy: QuestionnaireStatusMgm = Object.assign({}, questionnaireStatus);

        if (questionnaireStatus.created) {
            copy.created = this.dateUtils.toDate(String(questionnaireStatus.created));
        }

        if (questionnaireStatus.modified) {
            copy.modified = this.dateUtils.toDate(String(questionnaireStatus.modified));
        }

        return copy;
    }

    public getAllQuestionnaireStatusesByCompanyProfile(companyProfile: CompanyProfileMgm): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            this.questionnaireStatusesByCompanyProfile
                .replace(COMPANY_ID_PLACEHOLDER, String(companyProfile.id)),
            {observe: 'response'}
        ).map((res: HttpResponse<QuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }

    public getAllQuestionnaireStatusesByCompanyProfileAndUser(companyProfile: CompanyProfileMgm, user: User): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            this.questionnaireStatusesByCompanyProfileAndUser
                .replace(COMPANY_ID_PLACEHOLDER, String(companyProfile.id))
                .replace(USER_ID_PLACEHOLDER, String(user.id)),
            {observe: 'response'}
        ).map((res: HttpResponse<QuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }

    public getAllQuestionnaireStatusesByCompanyProfileAndQuestionnairePurpose(companyProfile: CompanyProfileMgm, purpose: QuestionnairePurpose): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            this.questionnaireStatusesByCompanyProfileAndQuestionnairePurpose
                .replace(COMPANY_ID_PLACEHOLDER, String(companyProfile.id))
                .replace(QUESTIONNAIRE_PURPOSE_PLACEHOLDER, QuestionnairePurpose[purpose]),
            {observe: 'response'}
        ).map((res: HttpResponse<QuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }

    public getAllQuestionnaireStatusesByCompanyProfileQuestionnaireAndRole(companyProfile: CompanyProfileMgm, questionnaire: QuestionMgm, role: Role): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            this.questionnaireStatusesByCompanyProfileQuestionnaireAndRole
                .replace(COMPANY_ID_PLACEHOLDER, String(companyProfile.id))
                .replace(QUESTIONNAIRE_ID_PLACEHOLDER, String(questionnaire.id))
                .replace(ROLE_PLACEHOLDER, Role[role]),
            {observe: 'response'}
        ).map((res: HttpResponse<QuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }

    //questionnaireStatusesByCompanyProfileQuestionnairePurposeAndUser
    public getAllQuestionnaireStatusesByCompanyProfileQuestionnairePurposeAndUser(companyProfile: CompanyProfileMgm, questionnairePurpose: QuestionnairePurpose, user: User): Observable<HttpResponse<QuestionnaireStatusMgm[]>> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            this.questionnaireStatusesByCompanyProfileQuestionnairePurposeAndUser
                .replace(COMPANY_ID_PLACEHOLDER, String(companyProfile.id))
                .replace(QUESTIONNAIRE_PURPOSE_PLACEHOLDER, QuestionnairePurpose[questionnairePurpose])
                .replace(USER_ID_PLACEHOLDER, String(user.id)),
            {observe: 'response'}
        ).map((res: HttpResponse<QuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }

    public getAllQuestionnaireStatusesByCurrentUserAndQuestionnairePurpose(questionnairePurpose: QuestionnairePurpose): Observable<QuestionnaireStatusMgm[]> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            this.questionnaireStatusesByCurrentUserAndQuestionnairePurpose
                .replace(QUESTIONNAIRE_PURPOSE_PLACEHOLDER, QuestionnairePurpose[questionnairePurpose])
        );
    }
}
