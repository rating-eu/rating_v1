import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { MitigationMgm } from './mitigation-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<MitigationMgm>;

@Injectable()
export class MitigationMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/mitigations';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/mitigations';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(mitigation: MitigationMgm): Observable<EntityResponseType> {
        const copy = this.convert(mitigation);
        return this.http.post<MitigationMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(mitigation: MitigationMgm): Observable<EntityResponseType> {
        const copy = this.convert(mitigation);
        return this.http.put<MitigationMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MitigationMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<MitigationMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MitigationMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MitigationMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<MitigationMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MitigationMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MitigationMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MitigationMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MitigationMgm[]>): HttpResponse<MitigationMgm[]> {
        const jsonResponse: MitigationMgm[] = res.body;
        const body: MitigationMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to MitigationMgm.
     */
    private convertItemFromServer(mitigation: MitigationMgm): MitigationMgm {
        const copy: MitigationMgm = Object.assign({}, mitigation);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(mitigation.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(mitigation.modified);
        return copy;
    }

    /**
     * Convert a MitigationMgm to a JSON which can be sent to the server.
     */
    private convert(mitigation: MitigationMgm): MitigationMgm {
        const copy: MitigationMgm = Object.assign({}, mitigation);

        copy.created = this.dateUtils.toDate(mitigation.created);

        copy.modified = this.dateUtils.toDate(mitigation.modified);
        return copy;
    }
}
