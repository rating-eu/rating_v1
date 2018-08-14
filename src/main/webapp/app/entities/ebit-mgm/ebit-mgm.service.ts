import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { EBITMgm } from './ebit-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<EBITMgm>;

@Injectable()
export class EBITMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/ebits';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/ebits';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(eBIT: EBITMgm): Observable<EntityResponseType> {
        const copy = this.convert(eBIT);
        return this.http.post<EBITMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(eBIT: EBITMgm): Observable<EntityResponseType> {
        const copy = this.convert(eBIT);
        return this.http.put<EBITMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<EBITMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<EBITMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<EBITMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<EBITMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<EBITMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<EBITMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<EBITMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: EBITMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<EBITMgm[]>): HttpResponse<EBITMgm[]> {
        const jsonResponse: EBITMgm[] = res.body;
        const body: EBITMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to EBITMgm.
     */
    private convertItemFromServer(eBIT: EBITMgm): EBITMgm {
        const copy: EBITMgm = Object.assign({}, eBIT);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(eBIT.created);
        return copy;
    }

    /**
     * Convert a EBITMgm to a JSON which can be sent to the server.
     */
    private convert(eBIT: EBITMgm): EBITMgm {
        const copy: EBITMgm = Object.assign({}, eBIT);

        copy.created = this.dateUtils.toDate(eBIT.created);
        return copy;
    }
}
