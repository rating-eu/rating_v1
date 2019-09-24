import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { OverallSecurityImpactMgm } from './overall-security-impact-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OverallSecurityImpactMgm>;

@Injectable()
export class OverallSecurityImpactMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/overall-security-impacts';

    constructor(private http: HttpClient) { }

    create(overallSecurityImpact: OverallSecurityImpactMgm): Observable<EntityResponseType> {
        const copy = this.convert(overallSecurityImpact);
        return this.http.post<OverallSecurityImpactMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(overallSecurityImpact: OverallSecurityImpactMgm): Observable<EntityResponseType> {
        const copy = this.convert(overallSecurityImpact);
        return this.http.put<OverallSecurityImpactMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<OverallSecurityImpactMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<OverallSecurityImpactMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<OverallSecurityImpactMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<OverallSecurityImpactMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: OverallSecurityImpactMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<OverallSecurityImpactMgm[]>): HttpResponse<OverallSecurityImpactMgm[]> {
        const jsonResponse: OverallSecurityImpactMgm[] = res.body;
        const body: OverallSecurityImpactMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to OverallSecurityImpactMgm.
     */
    private convertItemFromServer(overallSecurityImpact: OverallSecurityImpactMgm): OverallSecurityImpactMgm {
        const copy: OverallSecurityImpactMgm = Object.assign({}, overallSecurityImpact);
        return copy;
    }

    /**
     * Convert a OverallSecurityImpactMgm to a JSON which can be sent to the server.
     */
    private convert(overallSecurityImpact: OverallSecurityImpactMgm): OverallSecurityImpactMgm {
        const copy: OverallSecurityImpactMgm = Object.assign({}, overallSecurityImpact);
        return copy;
    }
}
