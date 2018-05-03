import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { LikelihoodPositionMgm } from './likelihood-position-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LikelihoodPositionMgm>;

@Injectable()
export class LikelihoodPositionMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/likelihood-positions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/likelihood-positions';

    constructor(private http: HttpClient) { }

    create(likelihoodPosition: LikelihoodPositionMgm): Observable<EntityResponseType> {
        const copy = this.convert(likelihoodPosition);
        return this.http.post<LikelihoodPositionMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(likelihoodPosition: LikelihoodPositionMgm): Observable<EntityResponseType> {
        const copy = this.convert(likelihoodPosition);
        return this.http.put<LikelihoodPositionMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LikelihoodPositionMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LikelihoodPositionMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<LikelihoodPositionMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LikelihoodPositionMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<LikelihoodPositionMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<LikelihoodPositionMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LikelihoodPositionMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LikelihoodPositionMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LikelihoodPositionMgm[]>): HttpResponse<LikelihoodPositionMgm[]> {
        const jsonResponse: LikelihoodPositionMgm[] = res.body;
        const body: LikelihoodPositionMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LikelihoodPositionMgm.
     */
    private convertItemFromServer(likelihoodPosition: LikelihoodPositionMgm): LikelihoodPositionMgm {
        const copy: LikelihoodPositionMgm = Object.assign({}, likelihoodPosition);
        return copy;
    }

    /**
     * Convert a LikelihoodPositionMgm to a JSON which can be sent to the server.
     */
    private convert(likelihoodPosition: LikelihoodPositionMgm): LikelihoodPositionMgm {
        const copy: LikelihoodPositionMgm = Object.assign({}, likelihoodPosition);
        return copy;
    }
}
