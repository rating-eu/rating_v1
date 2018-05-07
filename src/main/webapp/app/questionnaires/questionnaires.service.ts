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

@Injectable()
export class QuestionnairesService {

    private questionnairesByPurposeAPIUrl = SERVER_API_URL + 'api/questionnaires/by/purpose/{purpose}';
    private questionsByQuestionnaireIDAPIUrl = SERVER_API_URL + 'api/questions/by/questionnaire/{questionnaireID}';
    private answersByQuestionIDAPIUrl = SERVER_API_URL + 'api/answers/by/question/{questionID}';

    private currentQuestionnaire: QuestionnaireMgm;

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    findAllQuestionnairesByPurpose(purpose: QuestionnairePurpose): Observable<QuestionnaireMgm[]> {
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

    findAllQuestionsByQuestionnaire(questionnaire: QuestionnaireMgm): Observable<QuestionMgm[]> {
        return this.http.get<QuestionnaireMgm[]>(this.questionsByQuestionnaireIDAPIUrl.replace('{questionnaireID}', String(questionnaire.id)));
    }

    getAllAnswersByQuestion(question: QuestionMgm): Observable<AnswerMgm[]> {
        return this.http.get<AnswerMgm[]>(this.answersByQuestionIDAPIUrl.replace('{questionID}', String(question.id)));
    }
}
