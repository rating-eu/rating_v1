import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { GDPRAnswerMgm } from './gdpr-answer-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<GDPRAnswerMgm>;

@Injectable()
export class GDPRAnswerMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/gdpr-answers';

    constructor(private http: HttpClient) { }

    create(gDPRAnswer: GDPRAnswerMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRAnswer);
        return this.http.post<GDPRAnswerMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(gDPRAnswer: GDPRAnswerMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRAnswer);
        return this.http.put<GDPRAnswerMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<GDPRAnswerMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<GDPRAnswerMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<GDPRAnswerMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<GDPRAnswerMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: GDPRAnswerMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<GDPRAnswerMgm[]>): HttpResponse<GDPRAnswerMgm[]> {
        const jsonResponse: GDPRAnswerMgm[] = res.body;
        const body: GDPRAnswerMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to GDPRAnswerMgm.
     */
    private convertItemFromServer(gDPRAnswer: GDPRAnswerMgm): GDPRAnswerMgm {
        const copy: GDPRAnswerMgm = Object.assign({}, gDPRAnswer);
        return copy;
    }

    /**
     * Convert a GDPRAnswerMgm to a JSON which can be sent to the server.
     */
    private convert(gDPRAnswer: GDPRAnswerMgm): GDPRAnswerMgm {
        const copy: GDPRAnswerMgm = Object.assign({}, gDPRAnswer);
        return copy;
    }
}
