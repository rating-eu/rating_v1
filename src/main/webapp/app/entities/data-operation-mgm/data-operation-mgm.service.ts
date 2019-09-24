import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { DataOperationMgm } from './data-operation-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<DataOperationMgm>;

@Injectable()
export class DataOperationMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/data-operations';

    constructor(private http: HttpClient) { }

    create(dataOperation: DataOperationMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataOperation);
        return this.http.post<DataOperationMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(dataOperation: DataOperationMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataOperation);
        return this.http.put<DataOperationMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DataOperationMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DataOperationMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DataOperationMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DataOperationMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DataOperationMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DataOperationMgm[]>): HttpResponse<DataOperationMgm[]> {
        const jsonResponse: DataOperationMgm[] = res.body;
        const body: DataOperationMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DataOperationMgm.
     */
    private convertItemFromServer(dataOperation: DataOperationMgm): DataOperationMgm {
        const copy: DataOperationMgm = Object.assign({}, dataOperation);
        return copy;
    }

    /**
     * Convert a DataOperationMgm to a JSON which can be sent to the server.
     */
    private convert(dataOperation: DataOperationMgm): DataOperationMgm {
        const copy: DataOperationMgm = Object.assign({}, dataOperation);
        return copy;
    }
}
