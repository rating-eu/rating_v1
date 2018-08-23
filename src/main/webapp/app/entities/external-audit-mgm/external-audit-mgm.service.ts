import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ExternalAuditMgm } from './external-audit-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ExternalAuditMgm>;

@Injectable()
export class ExternalAuditMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/external-audits';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/external-audits';

    constructor(private http: HttpClient) { }

    create(externalAudit: ExternalAuditMgm): Observable<EntityResponseType> {
        const copy = this.convert(externalAudit);
        return this.http.post<ExternalAuditMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(externalAudit: ExternalAuditMgm): Observable<EntityResponseType> {
        const copy = this.convert(externalAudit);
        return this.http.put<ExternalAuditMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ExternalAuditMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ExternalAuditMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ExternalAuditMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ExternalAuditMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ExternalAuditMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ExternalAuditMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ExternalAuditMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ExternalAuditMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ExternalAuditMgm[]>): HttpResponse<ExternalAuditMgm[]> {
        const jsonResponse: ExternalAuditMgm[] = res.body;
        const body: ExternalAuditMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ExternalAuditMgm.
     */
    private convertItemFromServer(externalAudit: ExternalAuditMgm): ExternalAuditMgm {
        const copy: ExternalAuditMgm = Object.assign({}, externalAudit);
        return copy;
    }

    /**
     * Convert a ExternalAuditMgm to a JSON which can be sent to the server.
     */
    private convert(externalAudit: ExternalAuditMgm): ExternalAuditMgm {
        const copy: ExternalAuditMgm = Object.assign({}, externalAudit);
        return copy;
    }
}
