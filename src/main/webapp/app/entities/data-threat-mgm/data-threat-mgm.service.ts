import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {DataThreatMgm} from './data-threat-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<DataThreatMgm>;

const OPERATION_ID = '{operationID}';

@Injectable()
export class DataThreatMgmService {

    private resourceUrl = SERVER_API_URL + 'api/data-threats';
    private resourceByDataOperationUrl = SERVER_API_URL + 'api/data-threats/operation/' + OPERATION_ID;

    constructor(private http: HttpClient) {
    }

    create(dataThreat: DataThreatMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataThreat);
        return this.http.post<DataThreatMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(dataThreat: DataThreatMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataThreat);
        return this.http.put<DataThreatMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DataThreatMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DataThreatMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DataThreatMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<DataThreatMgm[]>) => this.convertArrayResponse(res));
    }

    getAllByDataOperation(operationID: number): Observable<HttpResponse<DataThreatMgm[]>> {
        const options = createRequestOption();
        return this.http.get<DataThreatMgm[]>(this.resourceByDataOperationUrl.replace(OPERATION_ID, String(operationID)),
            {params: options, observe: 'response'})
            .map((res: HttpResponse<DataThreatMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DataThreatMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DataThreatMgm[]>): HttpResponse<DataThreatMgm[]> {
        const jsonResponse: DataThreatMgm[] = res.body;
        const body: DataThreatMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DataThreatMgm.
     */
    private convertItemFromServer(dataThreat: DataThreatMgm): DataThreatMgm {
        const copy: DataThreatMgm = Object.assign({}, dataThreat);
        return copy;
    }

    /**
     * Convert a DataThreatMgm to a JSON which can be sent to the server.
     */
    private convert(dataThreat: DataThreatMgm): DataThreatMgm {
        const copy: DataThreatMgm = Object.assign({}, dataThreat);
        return copy;
    }
}
