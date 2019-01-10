import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { SplittingValueMgm } from './splitting-value-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SplittingValueMgm>;

@Injectable()
export class SplittingValueMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/splitting-values';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/splitting-values';

    constructor(private http: HttpClient) { }

    create(splittingValue: SplittingValueMgm): Observable<EntityResponseType> {
        const copy = this.convert(splittingValue);
        return this.http.post<SplittingValueMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(splittingValue: SplittingValueMgm): Observable<EntityResponseType> {
        const copy = this.convert(splittingValue);
        return this.http.put<SplittingValueMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SplittingValueMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SplittingValueMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<SplittingValueMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SplittingValueMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<SplittingValueMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<SplittingValueMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SplittingValueMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SplittingValueMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SplittingValueMgm[]>): HttpResponse<SplittingValueMgm[]> {
        const jsonResponse: SplittingValueMgm[] = res.body;
        const body: SplittingValueMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SplittingValueMgm.
     */
    private convertItemFromServer(splittingValue: SplittingValueMgm): SplittingValueMgm {
        const copy: SplittingValueMgm = Object.assign({}, splittingValue);
        return copy;
    }

    /**
     * Convert a SplittingValueMgm to a JSON which can be sent to the server.
     */
    private convert(splittingValue: SplittingValueMgm): SplittingValueMgm {
        const copy: SplittingValueMgm = Object.assign({}, splittingValue);
        return copy;
    }
}
