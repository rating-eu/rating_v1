import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { GDPRQuestionnaireMgm } from './gdpr-questionnaire-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<GDPRQuestionnaireMgm>;

@Injectable()
export class GDPRQuestionnaireMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/gdpr-questionnaires';

    constructor(private http: HttpClient) { }

    create(gDPRQuestionnaire: GDPRQuestionnaireMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRQuestionnaire);
        return this.http.post<GDPRQuestionnaireMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(gDPRQuestionnaire: GDPRQuestionnaireMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRQuestionnaire);
        return this.http.put<GDPRQuestionnaireMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<GDPRQuestionnaireMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<GDPRQuestionnaireMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<GDPRQuestionnaireMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<GDPRQuestionnaireMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: GDPRQuestionnaireMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<GDPRQuestionnaireMgm[]>): HttpResponse<GDPRQuestionnaireMgm[]> {
        const jsonResponse: GDPRQuestionnaireMgm[] = res.body;
        const body: GDPRQuestionnaireMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to GDPRQuestionnaireMgm.
     */
    private convertItemFromServer(gDPRQuestionnaire: GDPRQuestionnaireMgm): GDPRQuestionnaireMgm {
        const copy: GDPRQuestionnaireMgm = Object.assign({}, gDPRQuestionnaire);
        return copy;
    }

    /**
     * Convert a GDPRQuestionnaireMgm to a JSON which can be sent to the server.
     */
    private convert(gDPRQuestionnaire: GDPRQuestionnaireMgm): GDPRQuestionnaireMgm {
        const copy: GDPRQuestionnaireMgm = Object.assign({}, gDPRQuestionnaire);
        return copy;
    }
}
