import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {OverallDataRiskMgm} from './overall-data-risk-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<OverallDataRiskMgm>;

const OPERATION_ID = '{operationID}';

@Injectable()
export class OverallDataRiskMgmService {

    private resourceUrl = SERVER_API_URL + 'api/overall-data-risks';
    private resourceByDataOperationUrl = SERVER_API_URL + 'api/overall-data-risks/operation/' + OPERATION_ID;

    constructor(private http: HttpClient) {
    }

    create(overallDataRisk: OverallDataRiskMgm): Observable<EntityResponseType> {
        const copy = this.convert(overallDataRisk);
        return this.http.post<OverallDataRiskMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(overallDataRisk: OverallDataRiskMgm): Observable<EntityResponseType> {
        const copy = this.convert(overallDataRisk);
        return this.http.put<OverallDataRiskMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<OverallDataRiskMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }


    getByDataOperation(operationID: number) {
        return this.http.get<OverallDataRiskMgm>(this.resourceByDataOperationUrl.replace(OPERATION_ID, String(operationID)), {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<OverallDataRiskMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<OverallDataRiskMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<OverallDataRiskMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: OverallDataRiskMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<OverallDataRiskMgm[]>): HttpResponse<OverallDataRiskMgm[]> {
        const jsonResponse: OverallDataRiskMgm[] = res.body;
        const body: OverallDataRiskMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to OverallDataRiskMgm.
     */
    private convertItemFromServer(overallDataRisk: OverallDataRiskMgm): OverallDataRiskMgm {
        const copy: OverallDataRiskMgm = Object.assign({}, overallDataRisk);
        return copy;
    }

    /**
     * Convert a OverallDataRiskMgm to a JSON which can be sent to the server.
     */
    private convert(overallDataRisk: OverallDataRiskMgm): OverallDataRiskMgm {
        const copy: OverallDataRiskMgm = Object.assign({}, overallDataRisk);
        return copy;
    }
}
