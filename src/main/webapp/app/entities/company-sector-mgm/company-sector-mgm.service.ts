import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { CompanySectorMgm } from './company-sector-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<CompanySectorMgm>;

@Injectable()
export class CompanySectorMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/company-sectors';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/company-sectors';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(companySector: CompanySectorMgm): Observable<EntityResponseType> {
        const copy = this.convert(companySector);
        return this.http.post<CompanySectorMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(companySector: CompanySectorMgm): Observable<EntityResponseType> {
        const copy = this.convert(companySector);
        return this.http.put<CompanySectorMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CompanySectorMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CompanySectorMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<CompanySectorMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CompanySectorMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CompanySectorMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<CompanySectorMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CompanySectorMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CompanySectorMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CompanySectorMgm[]>): HttpResponse<CompanySectorMgm[]> {
        const jsonResponse: CompanySectorMgm[] = res.body;
        const body: CompanySectorMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CompanySectorMgm.
     */
    private convertItemFromServer(companySector: CompanySectorMgm): CompanySectorMgm {
        const copy: CompanySectorMgm = Object.assign({}, companySector);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(companySector.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(companySector.modified);
        return copy;
    }

    /**
     * Convert a CompanySectorMgm to a JSON which can be sent to the server.
     */
    private convert(companySector: CompanySectorMgm): CompanySectorMgm {
        const copy: CompanySectorMgm = Object.assign({}, companySector);

        copy.created = this.dateUtils.toDate(companySector.created);

        copy.modified = this.dateUtils.toDate(companySector.modified);
        return copy;
    }
}
