import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {QuestionRelevanceMgm} from './question-relevance-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<QuestionRelevanceMgm>;

const QUESTIONNAIRE_STATUS_ID = '{questionnaireStatusID}';

@Injectable()
export class QuestionRelevanceMgmService {

    private resourceUrl = SERVER_API_URL + 'api/question-relevances';
    private resourceByQuestionnaireStatusUrl = SERVER_API_URL + 'api/question-relevances/questionnaire-status/' + QUESTIONNAIRE_STATUS_ID;

    constructor(private http: HttpClient) {
    }

    create(questionRelevance: QuestionRelevanceMgm): Observable<EntityResponseType> {
        const copy = this.convert(questionRelevance);
        return this.http.post<QuestionRelevanceMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(questionRelevance: QuestionRelevanceMgm): Observable<EntityResponseType> {
        const copy = this.convert(questionRelevance);
        return this.http.put<QuestionRelevanceMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionRelevanceMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    findAllByQuestionnaireStatus(questionnaireStatusID: number): Observable<HttpResponse<QuestionRelevanceMgm[]>> {
        const options = createRequestOption();
        return this.http.get<QuestionRelevanceMgm[]>(this.resourceByQuestionnaireStatusUrl
            .replace(QUESTIONNAIRE_STATUS_ID, String(questionnaireStatusID)), {params: options, observe: 'response'})
            .map((res: HttpResponse<QuestionRelevanceMgm[]>) => this.convertArrayResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionRelevanceMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionRelevanceMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<QuestionRelevanceMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionRelevanceMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionRelevanceMgm[]>): HttpResponse<QuestionRelevanceMgm[]> {
        const jsonResponse: QuestionRelevanceMgm[] = res.body;
        const body: QuestionRelevanceMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionRelevanceMgm.
     */
    private convertItemFromServer(questionRelevance: QuestionRelevanceMgm): QuestionRelevanceMgm {
        const copy: QuestionRelevanceMgm = Object.assign({}, questionRelevance);
        return copy;
    }

    /**
     * Convert a QuestionRelevanceMgm to a JSON which can be sent to the server.
     */
    private convert(questionRelevance: QuestionRelevanceMgm): QuestionRelevanceMgm {
        const copy: QuestionRelevanceMgm = Object.assign({}, questionRelevance);
        return copy;
    }
}
