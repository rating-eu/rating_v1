import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ImpactLevelDescriptionMgm } from './impact-level-description-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ImpactLevelDescriptionMgm>;

@Injectable()
export class ImpactLevelDescriptionMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/impact-level-descriptions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/impact-level-descriptions';

    constructor(private http: HttpClient) { }

    create(impactLevelDescription: ImpactLevelDescriptionMgm): Observable<EntityResponseType> {
        const copy = this.convert(impactLevelDescription);
        return this.http.post<ImpactLevelDescriptionMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(impactLevelDescription: ImpactLevelDescriptionMgm): Observable<EntityResponseType> {
        const copy = this.convert(impactLevelDescription);
        return this.http.put<ImpactLevelDescriptionMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ImpactLevelDescriptionMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ImpactLevelDescriptionMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ImpactLevelDescriptionMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ImpactLevelDescriptionMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ImpactLevelDescriptionMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ImpactLevelDescriptionMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ImpactLevelDescriptionMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ImpactLevelDescriptionMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ImpactLevelDescriptionMgm[]>): HttpResponse<ImpactLevelDescriptionMgm[]> {
        const jsonResponse: ImpactLevelDescriptionMgm[] = res.body;
        const body: ImpactLevelDescriptionMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ImpactLevelDescriptionMgm.
     */
    private convertItemFromServer(impactLevelDescription: ImpactLevelDescriptionMgm): ImpactLevelDescriptionMgm {
        const copy: ImpactLevelDescriptionMgm = Object.assign({}, impactLevelDescription);
        return copy;
    }

    /**
     * Convert a ImpactLevelDescriptionMgm to a JSON which can be sent to the server.
     */
    private convert(impactLevelDescription: ImpactLevelDescriptionMgm): ImpactLevelDescriptionMgm {
        const copy: ImpactLevelDescriptionMgm = Object.assign({}, impactLevelDescription);
        return copy;
    }
}
