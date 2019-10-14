import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {GDPRQuestionnaireStatusMgm} from './gdpr-questionnaire-status-mgm.model';
import {createRequestOption} from '../../shared';
import {Role} from "../enumerations/Role.enum";

export type EntityResponseType = HttpResponse<GDPRQuestionnaireStatusMgm>;

const OPERATION_ID = '{operationID}';

const QUESTIONNAIRE_ID = '{questionnaireID}';

const ROLE = '{role}';

@Injectable()
export class GDPRQuestionnaireStatusMgmService {

    private resourceUrl = SERVER_API_URL + 'api/gdpr-questionnaire-statuses';

    private resourceByDataOperationQuestionnaireAndRole = SERVER_API_URL + 'api/gdpr-questionnaire-statuses/operation/' + OPERATION_ID + '/questionnaire/' + QUESTIONNAIRE_ID + '/role/' + ROLE;

    constructor(private http: HttpClient) {
    }

    create(gDPRQuestionnaireStatus: GDPRQuestionnaireStatusMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRQuestionnaireStatus);
        return this.http.post<GDPRQuestionnaireStatusMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(gDPRQuestionnaireStatus: GDPRQuestionnaireStatusMgm): Observable<EntityResponseType> {
        const copy = this.convert(gDPRQuestionnaireStatus);
        return this.http.put<GDPRQuestionnaireStatusMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<GDPRQuestionnaireStatusMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    findOneByDataOperationQuestionnaireAndRole(operatioID: number, questionnaireID: number, role: Role): Observable<EntityResponseType> {
        const url = this.resourceByDataOperationQuestionnaireAndRole
            .replace(OPERATION_ID, String(operatioID))
            .replace(QUESTIONNAIRE_ID, String(questionnaireID))
            .replace(ROLE, Role[role]);

        return this.http.get<GDPRQuestionnaireStatusMgm>(url, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<GDPRQuestionnaireStatusMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<GDPRQuestionnaireStatusMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<GDPRQuestionnaireStatusMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: GDPRQuestionnaireStatusMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<GDPRQuestionnaireStatusMgm[]>): HttpResponse<GDPRQuestionnaireStatusMgm[]> {
        const jsonResponse: GDPRQuestionnaireStatusMgm[] = res.body;
        const body: GDPRQuestionnaireStatusMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to GDPRQuestionnaireStatusMgm.
     */
    private convertItemFromServer(gDPRQuestionnaireStatus: GDPRQuestionnaireStatusMgm): GDPRQuestionnaireStatusMgm {
        const copy: GDPRQuestionnaireStatusMgm = Object.assign({}, gDPRQuestionnaireStatus);
        return copy;
    }

    /**
     * Convert a GDPRQuestionnaireStatusMgm to a JSON which can be sent to the server.
     */
    private convert(gDPRQuestionnaireStatus: GDPRQuestionnaireStatusMgm): GDPRQuestionnaireStatusMgm {
        const copy: GDPRQuestionnaireStatusMgm = Object.assign({}, gDPRQuestionnaireStatus);
        return copy;
    }
}
