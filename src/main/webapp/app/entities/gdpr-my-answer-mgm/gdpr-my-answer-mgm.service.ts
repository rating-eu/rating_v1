import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { GDPRMyAnswerMgm } from './gdpr-my-answer-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<GDPRMyAnswerMgm>;

@Injectable()
export class GDPRMyAnswerMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/gdpr-my-answers';

    constructor(private http: HttpClient) { }

    create(gDPRMyAnswer: GDPRMyAnswerMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRMyAnswer);
        return this.http.post<GDPRMyAnswerMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(gDPRMyAnswer: GDPRMyAnswerMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRMyAnswer);
        return this.http.put<GDPRMyAnswerMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<GDPRMyAnswerMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<GDPRMyAnswerMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<GDPRMyAnswerMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<GDPRMyAnswerMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: GDPRMyAnswerMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<GDPRMyAnswerMgm[]>): HttpResponse<GDPRMyAnswerMgm[]> {
        const jsonResponse: GDPRMyAnswerMgm[] = res.body;
        const body: GDPRMyAnswerMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to GDPRMyAnswerMgm.
     */
    private convertItemFromServer(gDPRMyAnswer: GDPRMyAnswerMgm): GDPRMyAnswerMgm {
        const copy: GDPRMyAnswerMgm = Object.assign({}, gDPRMyAnswer);
        return copy;
    }

    /**
     * Convert a GDPRMyAnswerMgm to a JSON which can be sent to the server.
     */
    private convert(gDPRMyAnswer: GDPRMyAnswerMgm): GDPRMyAnswerMgm {
        const copy: GDPRMyAnswerMgm = Object.assign({}, gDPRMyAnswer);
        return copy;
    }
}
