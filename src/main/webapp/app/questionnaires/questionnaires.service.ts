import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import {JhiDateUtils} from 'ng-jhipster';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {QuestionnaireMgm, QuestionnairePurpose} from '../entities/questionnaire-mgm';
import {QuestionMgm} from '../entities/question-mgm';
import {AnswerMgm} from '../entities/answer-mgm';
import {User} from '../shared';
import {MyAnswerMgm} from '../entities/my-answer-mgm';

@Injectable()
export class QuestionnairesService {

    private questionnairesByPurposeAPIUrl = SERVER_API_URL + 'api/questionnaires/by/purpose/{purpose}';
    private questionsByQuestionnaireIDAPIUrl = SERVER_API_URL + 'api/questions/by/questionnaire/{questionnaireID}';
    private answersByQuestionIDAPIUrl = SERVER_API_URL + 'api/answers/by/question/{questionID}';
    private myAnswersByQuestionnaireAndUser = SERVER_API_URL + 'api/my-answers/questionnaire/{questionnaireID}/user/{userID}';

    private currentQuestionnaire: QuestionnaireMgm;

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    getAllQuestionnairesByPurpose(purpose: QuestionnairePurpose): Observable<QuestionnaireMgm[]> {
        return this.http.get<QuestionnaireMgm[]>(this.questionnairesByPurposeAPIUrl.replace('{purpose}', String(purpose)));
    }

    setCurrentQuestionnaire(questionnaire: QuestionnaireMgm) {
        this.currentQuestionnaire = questionnaire;
        console.log('Set Current Questionnaire: ' + JSON.stringify(this.currentQuestionnaire));
    }

    getCurrentQuestionnaire(): QuestionnaireMgm {
        console.log('Get Current Questionnaire: ' + JSON.stringify(this.currentQuestionnaire));
        return this.currentQuestionnaire;
    }

    getAllQuestionsByQuestionnaire(questionnaire: QuestionnaireMgm): Observable<QuestionMgm[]> {
        return this.http.get<QuestionnaireMgm[]>(this.questionsByQuestionnaireIDAPIUrl.replace('{questionnaireID}', String(questionnaire.id)));
    }

    getAllAnswersByQuestion(question: QuestionMgm): Observable<AnswerMgm[]> {
        return this.http.get<AnswerMgm[]>(this.answersByQuestionIDAPIUrl.replace('{questionID}', String(question.id)));
    }

    getMyAnswersByQuestionnaireAndUser(questionnaire: QuestionnaireMgm, user: User): Observable<MyAnswerMgm[]> {
        return this.http.get<MyAnswerMgm[]>(this.myAnswersByQuestionnaireAndUser.replace('{questionnaireID}', String(questionnaire.id)).replace('{userID}', user.id));
    }
}
