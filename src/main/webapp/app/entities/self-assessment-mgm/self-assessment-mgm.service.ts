import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { SelfAssessmentMgm } from './self-assessment-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SelfAssessmentMgm>;

@Injectable()
export class SelfAssessmentMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/self-assessments';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/self-assessments';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(selfAssessment: SelfAssessmentMgm): Observable<EntityResponseType> {
        const copy = this.convert(selfAssessment);
        return this.http.post<SelfAssessmentMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(selfAssessment: SelfAssessmentMgm): Observable<EntityResponseType> {
        const copy = this.convert(selfAssessment);
        return this.http.put<SelfAssessmentMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SelfAssessmentMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SelfAssessmentMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<SelfAssessmentMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SelfAssessmentMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<SelfAssessmentMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<SelfAssessmentMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SelfAssessmentMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SelfAssessmentMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SelfAssessmentMgm[]>): HttpResponse<SelfAssessmentMgm[]> {
        const jsonResponse: SelfAssessmentMgm[] = res.body;
        const body: SelfAssessmentMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SelfAssessmentMgm.
     */
    private convertItemFromServer(selfAssessment: SelfAssessmentMgm): SelfAssessmentMgm {
        const copy: SelfAssessmentMgm = Object.assign({}, selfAssessment);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(selfAssessment.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(selfAssessment.modified);
        return copy;
    }

    /**
     * Convert a SelfAssessmentMgm to a JSON which can be sent to the server.
     */
    private convert(selfAssessment: SelfAssessmentMgm): SelfAssessmentMgm {
        const copy: SelfAssessmentMgm = Object.assign({}, selfAssessment);

        copy.created = this.dateUtils.toDate(selfAssessment.created);

        copy.modified = this.dateUtils.toDate(selfAssessment.modified);
        return copy;
    }
}
