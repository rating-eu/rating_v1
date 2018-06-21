import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {ThreatAgentMgm} from './threat-agent-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<ThreatAgentMgm>;

@Injectable()
export class ThreatAgentMgmService {

    private resourceUrl = SERVER_API_URL + 'api/threat-agents';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/threat-agents';
    private defaultThreatAgentsUrl = this.resourceUrl + '/default';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    create(threatAgent: ThreatAgentMgm): Observable<EntityResponseType> {
        const copy = this.convert(threatAgent);
        return this.http.post<ThreatAgentMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(threatAgent: ThreatAgentMgm): Observable<EntityResponseType> {
        const copy = this.convert(threatAgent);
        return this.http.put<ThreatAgentMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ThreatAgentMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ThreatAgentMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ThreatAgentMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<ThreatAgentMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ThreatAgentMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ThreatAgentMgm[]>(this.resourceSearchUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<ThreatAgentMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ThreatAgentMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ThreatAgentMgm[]>): HttpResponse<ThreatAgentMgm[]> {
        const jsonResponse: ThreatAgentMgm[] = res.body;
        const body: ThreatAgentMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ThreatAgentMgm.
     */
    private convertItemFromServer(threatAgent: ThreatAgentMgm): ThreatAgentMgm {
        const copy: ThreatAgentMgm = Object.assign({}, threatAgent);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(threatAgent.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(threatAgent.modified);
        return copy;
    }

    /**
     * Convert a ThreatAgentMgm to a JSON which can be sent to the server.
     */
    private convert(threatAgent: ThreatAgentMgm): ThreatAgentMgm {
        const copy: ThreatAgentMgm = Object.assign({}, threatAgent);

        copy.created = this.dateUtils.toDate(threatAgent.created);

        copy.modified = this.dateUtils.toDate(threatAgent.modified);
        return copy;
    }

    getDefaultThreatAgents(): Observable<HttpResponse<ThreatAgentMgm[]>> {
        const options = createRequestOption();
        return this.http.get<ThreatAgentMgm[]>(this.defaultThreatAgentsUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<ThreatAgentMgm[]>) => this.convertArrayResponse(res));
    }
}
