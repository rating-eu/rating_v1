import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {ImpactLevelMgm} from './impact-level-mgm.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<ImpactLevelMgm>;

const SELF_ASSESSMENT_ID_PLACEHOLDER = '{selfAssessmentID}';

@Injectable()
export class ImpactLevelMgmService {

    private resourceUrl = SERVER_API_URL + 'api/impact-levels';
    private resourceUrlBySelfAssessment = SERVER_API_URL + 'api/' + SELF_ASSESSMENT_ID_PLACEHOLDER + '/impact-levels';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/impact-levels';

    constructor(private http: HttpClient) {
    }

    create(impactLevel: ImpactLevelMgm): Observable<EntityResponseType> {
        const copy = this.convert(impactLevel);
        return this.http.post<ImpactLevelMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    createAll(impactLevels: ImpactLevelMgm[]): Observable<HttpResponse<ImpactLevelMgm[]>> {
        const copy = this.convertArray(impactLevels);
        return this.http.post<ImpactLevelMgm[]>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: HttpResponse<ImpactLevelMgm[]>) => this.convertArrayResponse(res));
    }

    update(impactLevel: ImpactLevelMgm): Observable<EntityResponseType> {
        const copy = this.convert(impactLevel);
        return this.http.put<ImpactLevelMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ImpactLevelMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ImpactLevelMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ImpactLevelMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<ImpactLevelMgm[]>) => this.convertArrayResponse(res));
    }

    findAllBySelfAssessment(selfAssessmentID: number): Observable<HttpResponse<ImpactLevelMgm[]>> {
        const options = createRequestOption(null);
        return this.http.get<ImpactLevelMgm[]>(this.resourceUrlBySelfAssessment.replace(SELF_ASSESSMENT_ID_PLACEHOLDER, selfAssessmentID + ''), {
            params: options,
            observe: 'response'
        })
            .map((res: HttpResponse<ImpactLevelMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ImpactLevelMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<ImpactLevelMgm[]>(this.resourceSearchUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<ImpactLevelMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ImpactLevelMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ImpactLevelMgm[]>): HttpResponse<ImpactLevelMgm[]> {
        const jsonResponse: ImpactLevelMgm[] = res.body;
        const body: ImpactLevelMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ImpactLevelMgm.
     */
    private convertItemFromServer(impactLevel: ImpactLevelMgm): ImpactLevelMgm {
        const copy: ImpactLevelMgm = Object.assign({}, impactLevel);
        return copy;
    }

    /**
     * Convert a ImpactLevelMgm to a JSON which can be sent to the server.
     */
    private convert(impactLevel: ImpactLevelMgm): ImpactLevelMgm {
        const copy: ImpactLevelMgm = Object.assign({}, impactLevel);
        return copy;
    }

    /**
     * Convert a ImpactLevelMgm to a JSON which can be sent to the server.
     */
    private convertArray(impactLevels: ImpactLevelMgm[]): ImpactLevelMgm[] {
        const copy: ImpactLevelMgm[] = [];

        if (impactLevels) {
            impactLevels.forEach((impactLevel: ImpactLevelMgm) => {
                copy.push(this.convert(impactLevel));
            });
        }

        return copy;
    }
}
