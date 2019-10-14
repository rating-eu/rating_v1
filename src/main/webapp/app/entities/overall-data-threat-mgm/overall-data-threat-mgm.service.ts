import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {OverallDataThreatMgm} from './overall-data-threat-mgm.model';
import {createRequestOption} from '../../shared';
import {OverallSecurityImpactMgm} from "../overall-security-impact-mgm";

export type EntityResponseType = HttpResponse<OverallDataThreatMgm>;

const OPERATION_ID_PLACEHOLDER = '{operationID}';

@Injectable()
export class OverallDataThreatMgmService {

    private resourceUrl = SERVER_API_URL + 'api/overall-data-threats';
    private resourceUrlByDataOperation = SERVER_API_URL + 'api/overall-data-threats/operation/' + OPERATION_ID_PLACEHOLDER;

    constructor(private http: HttpClient) {
    }

    create(overallDataThreat: OverallDataThreatMgm): Observable<EntityResponseType> {
        const copy = this.convert(overallDataThreat);
        return this.http.post<OverallDataThreatMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(overallDataThreat: OverallDataThreatMgm): Observable<EntityResponseType> {
        const copy = this.convert(overallDataThreat);
        return this.http.put<OverallDataThreatMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<OverallDataThreatMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<OverallDataThreatMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<OverallDataThreatMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<OverallDataThreatMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: OverallDataThreatMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<OverallDataThreatMgm[]>): HttpResponse<OverallDataThreatMgm[]> {
        const jsonResponse: OverallDataThreatMgm[] = res.body;
        const body: OverallDataThreatMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to OverallDataThreatMgm.
     */
    private convertItemFromServer(overallDataThreat: OverallDataThreatMgm): OverallDataThreatMgm {
        const copy: OverallDataThreatMgm = Object.assign({}, overallDataThreat);
        return copy;
    }

    /**
     * Convert a OverallDataThreatMgm to a JSON which can be sent to the server.
     */
    private convert(overallDataThreat: OverallDataThreatMgm): OverallDataThreatMgm {
        const copy: OverallDataThreatMgm = Object.assign({}, overallDataThreat);
        return copy;
    }

    getByDataOperation(operationID: number): Observable<EntityResponseType> {
        return this.http.get<OverallSecurityImpactMgm>(this.resourceUrlByDataOperation
            .replace(OPERATION_ID_PLACEHOLDER, String(operationID)), {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }
}
