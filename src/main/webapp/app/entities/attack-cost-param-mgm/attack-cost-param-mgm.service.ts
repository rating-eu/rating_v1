import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { AttackCostParamMgm } from './attack-cost-param-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<AttackCostParamMgm>;

@Injectable()
export class AttackCostParamMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/attack-cost-params';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/attack-cost-params';

    constructor(private http: HttpClient) { }

    create(attackCostParam: AttackCostParamMgm): Observable<EntityResponseType> {
        const copy = this.convert(attackCostParam);
        return this.http.post<AttackCostParamMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(attackCostParam: AttackCostParamMgm): Observable<EntityResponseType> {
        const copy = this.convert(attackCostParam);
        return this.http.put<AttackCostParamMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<AttackCostParamMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<AttackCostParamMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AttackCostParamMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AttackCostParamMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<AttackCostParamMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AttackCostParamMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AttackCostParamMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: AttackCostParamMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<AttackCostParamMgm[]>): HttpResponse<AttackCostParamMgm[]> {
        const jsonResponse: AttackCostParamMgm[] = res.body;
        const body: AttackCostParamMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to AttackCostParamMgm.
     */
    private convertItemFromServer(attackCostParam: AttackCostParamMgm): AttackCostParamMgm {
        const copy: AttackCostParamMgm = Object.assign({}, attackCostParam);
        return copy;
    }

    /**
     * Convert a AttackCostParamMgm to a JSON which can be sent to the server.
     */
    private convert(attackCostParam: AttackCostParamMgm): AttackCostParamMgm {
        const copy: AttackCostParamMgm = Object.assign({}, attackCostParam);
        return copy;
    }
}
