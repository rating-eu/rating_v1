import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { LevelWrapperMgm } from './level-wrapper-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LevelWrapperMgm>;

@Injectable()
export class LevelWrapperMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/level-wrappers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/level-wrappers';

    constructor(private http: HttpClient) { }

    create(levelWrapper: LevelWrapperMgm): Observable<EntityResponseType> {
        const copy = this.convert(levelWrapper);
        return this.http.post<LevelWrapperMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(levelWrapper: LevelWrapperMgm): Observable<EntityResponseType> {
        const copy = this.convert(levelWrapper);
        return this.http.put<LevelWrapperMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LevelWrapperMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LevelWrapperMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<LevelWrapperMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LevelWrapperMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<LevelWrapperMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<LevelWrapperMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LevelWrapperMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LevelWrapperMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LevelWrapperMgm[]>): HttpResponse<LevelWrapperMgm[]> {
        const jsonResponse: LevelWrapperMgm[] = res.body;
        const body: LevelWrapperMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LevelWrapperMgm.
     */
    private convertItemFromServer(levelWrapper: LevelWrapperMgm): LevelWrapperMgm {
        const copy: LevelWrapperMgm = Object.assign({}, levelWrapper);
        return copy;
    }

    /**
     * Convert a LevelWrapperMgm to a JSON which can be sent to the server.
     */
    private convert(levelWrapper: LevelWrapperMgm): LevelWrapperMgm {
        const copy: LevelWrapperMgm = Object.assign({}, levelWrapper);
        return copy;
    }
}
