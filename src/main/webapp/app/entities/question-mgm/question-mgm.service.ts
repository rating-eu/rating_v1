import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {QuestionMgm} from './question-mgm.model';
import {createRequestOption} from '../../shared';
import {QuestionnaireMgm} from '../questionnaire-mgm';
import {MyAnswerMgm} from '../my-answer-mgm/my-answer-mgm.model';

export type EntityResponseType = HttpResponse<QuestionMgm>;

@Injectable()
export class QuestionMgmService {

    private resourceUrl = SERVER_API_URL + 'api/questions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/questions';
    private questionsByQuestionnaireIDAPIUrl = SERVER_API_URL + 'api/questions/by/questionnaire/{questionnaireID}';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    create(question: QuestionMgm): Observable<EntityResponseType> {
        const copy = this.convert(question);
        return this.http.post<QuestionMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(question: QuestionMgm): Observable<EntityResponseType> {
        const copy = this.convert(question);
        return this.http.put<QuestionMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<QuestionMgm[]>) => this.convertArrayResponse(res));
    }

    getQuestionsByQuestionnaire(questionnaireID: number): Observable<HttpResponse<QuestionMgm[]>> {
        const options = createRequestOption();

        return this.http.get<QuestionnaireMgm[]>(this.questionsByQuestionnaireIDAPIUrl.replace('{questionnaireID}', String(questionnaireID)), {
            params: options,
            observe: 'response'
        }).map((res: HttpResponse<MyAnswerMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<QuestionMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionMgm[]>(this.resourceSearchUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<QuestionMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionMgm[]>): HttpResponse<QuestionMgm[]> {
        const jsonResponse: QuestionMgm[] = res.body;
        const body: QuestionMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionMgm.
     */
    private convertItemFromServer(question: QuestionMgm): QuestionMgm {
        const copy: QuestionMgm = Object.assign({}, question);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(question.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(question.modified);
        return copy;
    }

    /**
     * Convert a QuestionMgm to a JSON which can be sent to the server.
     */
    private convert(question: QuestionMgm): QuestionMgm {
        const copy: QuestionMgm = Object.assign({}, question);

        copy.created = this.dateUtils.toDate(question.created);

        copy.modified = this.dateUtils.toDate(question.modified);
        return copy;
    }
}
