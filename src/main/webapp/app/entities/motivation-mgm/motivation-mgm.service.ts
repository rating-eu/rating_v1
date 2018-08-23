import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { MotivationMgm } from './motivation-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<MotivationMgm>;

@Injectable()
export class MotivationMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/motivations';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/motivations';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(motivation: MotivationMgm): Observable<EntityResponseType> {
        const copy = this.convert(motivation);
        return this.http.post<MotivationMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(motivation: MotivationMgm): Observable<EntityResponseType> {
        const copy = this.convert(motivation);
        return this.http.put<MotivationMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MotivationMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<MotivationMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MotivationMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MotivationMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<MotivationMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MotivationMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MotivationMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MotivationMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MotivationMgm[]>): HttpResponse<MotivationMgm[]> {
        const jsonResponse: MotivationMgm[] = res.body;
        const body: MotivationMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to MotivationMgm.
     */
    private convertItemFromServer(motivation: MotivationMgm): MotivationMgm {
        const copy: MotivationMgm = Object.assign({}, motivation);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(motivation.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(motivation.modified);
        return copy;
    }

    /**
     * Convert a MotivationMgm to a JSON which can be sent to the server.
     */
    private convert(motivation: MotivationMgm): MotivationMgm {
        const copy: MotivationMgm = Object.assign({}, motivation);

        copy.created = this.dateUtils.toDate(motivation.created);

        copy.modified = this.dateUtils.toDate(motivation.modified);
        return copy;
    }
}
