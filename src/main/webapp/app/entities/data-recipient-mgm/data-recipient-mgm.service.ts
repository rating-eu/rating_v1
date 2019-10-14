import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { DataRecipientMgm } from './data-recipient-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<DataRecipientMgm>;

@Injectable()
export class DataRecipientMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/data-recipients';

    constructor(private http: HttpClient) { }

    create(dataRecipient: DataRecipientMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataRecipient);
        return this.http.post<DataRecipientMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(dataRecipient: DataRecipientMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataRecipient);
        return this.http.put<DataRecipientMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DataRecipientMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DataRecipientMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DataRecipientMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DataRecipientMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DataRecipientMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DataRecipientMgm[]>): HttpResponse<DataRecipientMgm[]> {
        const jsonResponse: DataRecipientMgm[] = res.body;
        const body: DataRecipientMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DataRecipientMgm.
     */
    private convertItemFromServer(dataRecipient: DataRecipientMgm): DataRecipientMgm {
        const copy: DataRecipientMgm = Object.assign({}, dataRecipient);
        return copy;
    }

    /**
     * Convert a DataRecipientMgm to a JSON which can be sent to the server.
     */
    private convert(dataRecipient: DataRecipientMgm): DataRecipientMgm {
        const copy: DataRecipientMgm = Object.assign({}, dataRecipient);
        return copy;
    }
}
