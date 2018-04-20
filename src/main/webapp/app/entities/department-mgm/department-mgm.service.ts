import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { DepartmentMgm } from './department-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<DepartmentMgm>;

@Injectable()
export class DepartmentMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/departments';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/departments';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(department: DepartmentMgm): Observable<EntityResponseType> {
        const copy = this.convert(department);
        return this.http.post<DepartmentMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(department: DepartmentMgm): Observable<EntityResponseType> {
        const copy = this.convert(department);
        return this.http.put<DepartmentMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DepartmentMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DepartmentMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DepartmentMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DepartmentMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<DepartmentMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DepartmentMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DepartmentMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DepartmentMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DepartmentMgm[]>): HttpResponse<DepartmentMgm[]> {
        const jsonResponse: DepartmentMgm[] = res.body;
        const body: DepartmentMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DepartmentMgm.
     */
    private convertItemFromServer(department: DepartmentMgm): DepartmentMgm {
        const copy: DepartmentMgm = Object.assign({}, department);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(department.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(department.modified);
        return copy;
    }

    /**
     * Convert a DepartmentMgm to a JSON which can be sent to the server.
     */
    private convert(department: DepartmentMgm): DepartmentMgm {
        const copy: DepartmentMgm = Object.assign({}, department);

        copy.created = this.dateUtils.toDate(department.created);

        copy.modified = this.dateUtils.toDate(department.modified);
        return copy;
    }
}
