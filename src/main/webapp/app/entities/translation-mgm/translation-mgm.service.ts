import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { TranslationMgm } from './translation-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<TranslationMgm>;

@Injectable()
export class TranslationMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/translations';

    constructor(private http: HttpClient) { }

    create(translation: TranslationMgm): Observable<EntityResponseType> {
        const copy = this.convert(translation);
        return this.http.post<TranslationMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(translation: TranslationMgm): Observable<EntityResponseType> {
        const copy = this.convert(translation);
        return this.http.put<TranslationMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<TranslationMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<TranslationMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<TranslationMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<TranslationMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: TranslationMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<TranslationMgm[]>): HttpResponse<TranslationMgm[]> {
        const jsonResponse: TranslationMgm[] = res.body;
        const body: TranslationMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to TranslationMgm.
     */
    private convertItemFromServer(translation: TranslationMgm): TranslationMgm {
        const copy: TranslationMgm = Object.assign({}, translation);
        return copy;
    }

    /**
     * Convert a TranslationMgm to a JSON which can be sent to the server.
     */
    private convert(translation: TranslationMgm): TranslationMgm {
        const copy: TranslationMgm = Object.assign({}, translation);
        return copy;
    }
}
