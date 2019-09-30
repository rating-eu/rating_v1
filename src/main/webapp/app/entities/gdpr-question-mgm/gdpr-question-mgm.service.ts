import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {GDPRQuestionMgm} from './gdpr-question-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<GDPRQuestionMgm>;

const QUESTIONNAIRE_PLACEHOLDER = '{questionnaireID}';

@Injectable()
export class GDPRQuestionMgmService {

    private resourceUrl = SERVER_API_URL + 'api/gdpr-questions';

    private resourceByQuestionnaireUrl = SERVER_API_URL + 'api/gdpr-questions/questionnaire/' + QUESTIONNAIRE_PLACEHOLDER;

    constructor(private http: HttpClient) {
    }

    create(gDPRQuestion: GDPRQuestionMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRQuestion);
        return this.http.post<GDPRQuestionMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(gDPRQuestion: GDPRQuestionMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRQuestion);
        return this.http.put<GDPRQuestionMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<GDPRQuestionMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<GDPRQuestionMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<GDPRQuestionMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<GDPRQuestionMgm[]>) => this.convertArrayResponse(res));
    }

    getAllByQuestionnaire(questionnaireID: number) {
        const options = createRequestOption();

        return this.http.get<GDPRQuestionMgm[]>(this.resourceByQuestionnaireUrl
            .replace(QUESTIONNAIRE_PLACEHOLDER, String(questionnaireID)), {params: options, observe: 'response'})
            .map((res: HttpResponse<GDPRQuestionMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: GDPRQuestionMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<GDPRQuestionMgm[]>): HttpResponse<GDPRQuestionMgm[]> {
        const jsonResponse: GDPRQuestionMgm[] = res.body;
        const body: GDPRQuestionMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to GDPRQuestionMgm.
     */
    private convertItemFromServer(gDPRQuestion: GDPRQuestionMgm): GDPRQuestionMgm {
        const copy: GDPRQuestionMgm = Object.assign({}, gDPRQuestion);
        return copy;
    }

    /**
     * Convert a GDPRQuestionMgm to a JSON which can be sent to the server.
     */
    private convert(gDPRQuestion: GDPRQuestionMgm): GDPRQuestionMgm {
        const copy: GDPRQuestionMgm = Object.assign({}, gDPRQuestion);
        return copy;
    }
}
