import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { AnswerWeightMgm } from './answer-weight-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<AnswerWeightMgm>;

@Injectable()
export class AnswerWeightMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/answer-weights';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/answer-weights';

    constructor(private http: HttpClient) { }

    create(answerWeight: AnswerWeightMgm): Observable<EntityResponseType> {
        const copy = this.convert(answerWeight);
        return this.http.post<AnswerWeightMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(answerWeight: AnswerWeightMgm): Observable<EntityResponseType> {
        const copy = this.convert(answerWeight);
        return this.http.put<AnswerWeightMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<AnswerWeightMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<AnswerWeightMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AnswerWeightMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AnswerWeightMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<AnswerWeightMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AnswerWeightMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AnswerWeightMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: AnswerWeightMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<AnswerWeightMgm[]>): HttpResponse<AnswerWeightMgm[]> {
        const jsonResponse: AnswerWeightMgm[] = res.body;
        const body: AnswerWeightMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to AnswerWeightMgm.
     */
    private convertItemFromServer(answerWeight: AnswerWeightMgm): AnswerWeightMgm {
        const copy: AnswerWeightMgm = Object.assign({}, answerWeight);
        return copy;
    }

    /**
     * Convert a AnswerWeightMgm to a JSON which can be sent to the server.
     */
    private convert(answerWeight: AnswerWeightMgm): AnswerWeightMgm {
        const copy: AnswerWeightMgm = Object.assign({}, answerWeight);
        return copy;
    }
}
