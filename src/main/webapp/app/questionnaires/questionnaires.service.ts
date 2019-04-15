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
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {QuestionnaireMgm} from '../entities/questionnaire-mgm';
import {QuestionnairePurpose} from '../entities/enumerations/QuestionnairePurpose.enum';
import {QuestionMgm} from '../entities/question-mgm';
import {AnswerMgm} from '../entities/answer-mgm';
import {User} from '../shared';
import {MyAnswerMgm} from '../entities/my-answer-mgm';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {QuestionnaireStatusMgm} from '../entities/questionnaire-status-mgm';

@Injectable()
export class QuestionnairesService {

    private questionnairesByPurposeAPIUrl = SERVER_API_URL + 'api/questionnaires/by/purpose/{purpose}';
    private questionsByQuestionnaireIDAPIUrl = SERVER_API_URL + 'api/questions/by/questionnaire/{questionnaireID}';
    private answersByQuestionIDAPIUrl = SERVER_API_URL + 'api/answers/by/question/{questionID}';
    private myAnswersByQuestionnaireAndUser = SERVER_API_URL + 'api/my-answers/questionnaire/{questionnaireID}/user/{userID}';
    private questionnaireStatusesBySelfAssessmentAndUser = SERVER_API_URL + 'api/questionnaire-statuses/self-assessment/{selfAssessmentID}/user/{userID}';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    getAllQuestionnairesByPurpose(purpose: QuestionnairePurpose): Observable<QuestionnaireMgm[]> {
        return this.http.get<QuestionnaireMgm[]>(this.questionnairesByPurposeAPIUrl.replace('{purpose}', String(purpose)));
    }

    getAllQuestionsByQuestionnaire(questionnaire: QuestionnaireMgm): Observable<QuestionMgm[]> {
        return this.http.get<QuestionMgm[]>(this.questionsByQuestionnaireIDAPIUrl.replace('{questionnaireID}', String(questionnaire.id)));
    }

    getMyAnswersByQuestionnaireAndUser(questionnaire: QuestionnaireMgm, user: User): Observable<MyAnswerMgm[]> {
        return this.http.get<MyAnswerMgm[]>(this.myAnswersByQuestionnaireAndUser.replace('{questionnaireID}', String(questionnaire.id)).replace('{userID}', user.id));
    }

    getQuestionnaireStatusesBySelfAssessmentAndUser(selfAssessment: SelfAssessmentMgm, user: User): Observable<QuestionnaireStatusMgm[]> {
        return this.http.get<QuestionnaireStatusMgm[]>(
            this.questionnaireStatusesBySelfAssessmentAndUser.replace('{selfAssessmentID}', String(selfAssessment.id)).replace('{userID}', user.id));
    }
}
