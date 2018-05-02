import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { PhaseWrapperMgm } from './phase-wrapper-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<PhaseWrapperMgm>;

@Injectable()
export class PhaseWrapperMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/phase-wrappers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/phase-wrappers';

    constructor(private http: HttpClient) { }

    create(phaseWrapper: PhaseWrapperMgm): Observable<EntityResponseType> {
        const copy = this.convert(phaseWrapper);
        return this.http.post<PhaseWrapperMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(phaseWrapper: PhaseWrapperMgm): Observable<EntityResponseType> {
        const copy = this.convert(phaseWrapper);
        return this.http.put<PhaseWrapperMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PhaseWrapperMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<PhaseWrapperMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<PhaseWrapperMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PhaseWrapperMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<PhaseWrapperMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<PhaseWrapperMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PhaseWrapperMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PhaseWrapperMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PhaseWrapperMgm[]>): HttpResponse<PhaseWrapperMgm[]> {
        const jsonResponse: PhaseWrapperMgm[] = res.body;
        const body: PhaseWrapperMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to PhaseWrapperMgm.
     */
    private convertItemFromServer(phaseWrapper: PhaseWrapperMgm): PhaseWrapperMgm {
        const copy: PhaseWrapperMgm = Object.assign({}, phaseWrapper);
        return copy;
    }

    /**
     * Convert a PhaseWrapperMgm to a JSON which can be sent to the server.
     */
    private convert(phaseWrapper: PhaseWrapperMgm): PhaseWrapperMgm {
        const copy: PhaseWrapperMgm = Object.assign({}, phaseWrapper);
        return copy;
    }
}
