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
