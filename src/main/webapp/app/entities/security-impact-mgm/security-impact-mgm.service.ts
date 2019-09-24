import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { SecurityImpactMgm } from './security-impact-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SecurityImpactMgm>;

@Injectable()
export class SecurityImpactMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/security-impacts';

    constructor(private http: HttpClient) { }

    create(securityImpact: SecurityImpactMgm): Observable<EntityResponseType> {
        const copy = this.convert(securityImpact);
        return this.http.post<SecurityImpactMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(securityImpact: SecurityImpactMgm): Observable<EntityResponseType> {
        const copy = this.convert(securityImpact);
        return this.http.put<SecurityImpactMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SecurityImpactMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SecurityImpactMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<SecurityImpactMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SecurityImpactMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SecurityImpactMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SecurityImpactMgm[]>): HttpResponse<SecurityImpactMgm[]> {
        const jsonResponse: SecurityImpactMgm[] = res.body;
        const body: SecurityImpactMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SecurityImpactMgm.
     */
    private convertItemFromServer(securityImpact: SecurityImpactMgm): SecurityImpactMgm {
        const copy: SecurityImpactMgm = Object.assign({}, securityImpact);
        return copy;
    }

    /**
     * Convert a SecurityImpactMgm to a JSON which can be sent to the server.
     */
    private convert(securityImpact: SecurityImpactMgm): SecurityImpactMgm {
        const copy: SecurityImpactMgm = Object.assign({}, securityImpact);
        return copy;
    }
}
