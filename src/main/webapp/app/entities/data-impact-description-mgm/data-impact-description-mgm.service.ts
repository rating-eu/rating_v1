import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { DataImpactDescriptionMgm } from './data-impact-description-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<DataImpactDescriptionMgm>;

@Injectable()
export class DataImpactDescriptionMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/data-impact-descriptions';

    constructor(private http: HttpClient) { }

    create(dataImpactDescription: DataImpactDescriptionMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataImpactDescription);
        return this.http.post<DataImpactDescriptionMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(dataImpactDescription: DataImpactDescriptionMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataImpactDescription);
        return this.http.put<DataImpactDescriptionMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DataImpactDescriptionMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DataImpactDescriptionMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DataImpactDescriptionMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DataImpactDescriptionMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DataImpactDescriptionMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DataImpactDescriptionMgm[]>): HttpResponse<DataImpactDescriptionMgm[]> {
        const jsonResponse: DataImpactDescriptionMgm[] = res.body;
        const body: DataImpactDescriptionMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DataImpactDescriptionMgm.
     */
    private convertItemFromServer(dataImpactDescription: DataImpactDescriptionMgm): DataImpactDescriptionMgm {
        const copy: DataImpactDescriptionMgm = Object.assign({}, dataImpactDescription);
        return copy;
    }

    /**
     * Convert a DataImpactDescriptionMgm to a JSON which can be sent to the server.
     */
    private convert(dataImpactDescription: DataImpactDescriptionMgm): DataImpactDescriptionMgm {
        const copy: DataImpactDescriptionMgm = Object.assign({}, dataImpactDescription);
        return copy;
    }
}
