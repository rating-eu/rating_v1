import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { SystemConfigMgm } from './system-config-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SystemConfigMgm>;

@Injectable()
export class SystemConfigMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/system-configs';

    constructor(private http: HttpClient) { }

    create(systemConfig: SystemConfigMgm): Observable<EntityResponseType> {
        const copy = this.convert(systemConfig);
        return this.http.post<SystemConfigMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(systemConfig: SystemConfigMgm): Observable<EntityResponseType> {
        const copy = this.convert(systemConfig);
        return this.http.put<SystemConfigMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SystemConfigMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SystemConfigMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<SystemConfigMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SystemConfigMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SystemConfigMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SystemConfigMgm[]>): HttpResponse<SystemConfigMgm[]> {
        const jsonResponse: SystemConfigMgm[] = res.body;
        const body: SystemConfigMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SystemConfigMgm.
     */
    private convertItemFromServer(systemConfig: SystemConfigMgm): SystemConfigMgm {
        const copy: SystemConfigMgm = Object.assign({}, systemConfig);
        return copy;
    }

    /**
     * Convert a SystemConfigMgm to a JSON which can be sent to the server.
     */
    private convert(systemConfig: SystemConfigMgm): SystemConfigMgm {
        const copy: SystemConfigMgm = Object.assign({}, systemConfig);
        return copy;
    }
}
