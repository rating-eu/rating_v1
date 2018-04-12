import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { AttackStrategyMgm } from '../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import { createRequestOption } from '../shared';

export type EntityResponseType = HttpResponse<AttackStrategyMgm>;

@Injectable()
export class EvaluateService {

    private resourceUrl =  SERVER_API_URL + 'api/attack-strategy';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/attack-strategy';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(threatAgent: AttackStrategyMgm): Observable<EntityResponseType> {
        const copy = this.convert(threatAgent);
        return this.http.post<AttackStrategyMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(threatAgent: AttackStrategyMgm): Observable<EntityResponseType> {
        const copy = this.convert(threatAgent);
        return this.http.put<AttackStrategyMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<AttackStrategyMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<AttackStrategyMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AttackStrategyMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AttackStrategyMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<AttackStrategyMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AttackStrategyMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AttackStrategyMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: AttackStrategyMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<AttackStrategyMgm[]>): HttpResponse<AttackStrategyMgm[]> {
        const jsonResponse: AttackStrategyMgm[] = res.body;
        const body: AttackStrategyMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ThreatAgentMgm.
     */
    private convertItemFromServer(attackStrategy: AttackStrategyMgm): AttackStrategyMgm {
        const copy: AttackStrategyMgm = Object.assign({}, attackStrategy);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(attackStrategy.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(attackStrategy.modified);
        return copy;
    }

    /**
     * Convert a ThreatAgentMgm to a JSON which can be sent to the server.
     */
    private convert(attackStrategy: AttackStrategyMgm): AttackStrategyMgm {
        const copy: AttackStrategyMgm = Object.assign({}, attackStrategy);

        copy.created = this.dateUtils.toDate(attackStrategy.created);

        copy.modified = this.dateUtils.toDate(attackStrategy.modified);
        return copy;
    }
}
