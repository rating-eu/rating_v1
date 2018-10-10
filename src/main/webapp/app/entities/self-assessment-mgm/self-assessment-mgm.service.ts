import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {isUndefined} from 'util';
import {Router} from '@angular/router';
import {JhiDateUtils} from 'ng-jhipster';

import {SelfAssessmentMgm} from './self-assessment-mgm.model';
import {createRequestOption} from '../../shared';
import {SessionStorageService} from '../../../../../../node_modules/ngx-webstorage';
import {Update} from '../../layouts/model/Update';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {SelfAssessmentOverview} from '../../my-self-assessments/models/SelfAssessmentOverview.model';

export type EntityResponseType = HttpResponse<SelfAssessmentMgm>;

@Injectable()
export class SelfAssessmentMgmService implements OnInit {

    private static readonly SELF_ASSESSMENT_KEY = 'selfAssessment';
    private static readonly COMPANY_PROFILE_KEY = '{companyProfileID}';
    private resourceUrl = SERVER_API_URL + 'api/self-assessments';
    private selfAssessmentOverviewUrl = SERVER_API_URL + 'api/{selfID}/overview';
    private resourceByCompanyUrl = SERVER_API_URL + 'api/self-assessments/by-company/' + SelfAssessmentMgmService.COMPANY_PROFILE_KEY;
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/self-assessments';
    private selfAssessmentSelected: SelfAssessmentMgm;

    constructor(
        private http: HttpClient,
        private dateUtils: JhiDateUtils,
        private router: Router,
        private sessionStorage: SessionStorageService,
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.selfAssessmentSelected = null;
    }

    clearSelfAssessment() {
        this.selfAssessmentSelected = null;
    }

    getOverwiew(): Observable<SelfAssessmentOverview> {
        const selfId = this.getSelfAssessment().id;
        if (!selfId) {
            return null;
        }
        const customURL = this.selfAssessmentOverviewUrl.replace('{selfID}', selfId.toString());
        return this.http.get<SelfAssessmentOverview>(`${customURL}`, {observe: 'response'})
            .map((res: HttpResponse<SelfAssessmentOverview>) => {
                return res.body;
            });
    }

    getSelfAssessment(): SelfAssessmentMgm {
        const self = this.sessionStorage.retrieve(SelfAssessmentMgmService.SELF_ASSESSMENT_KEY);
        if (!self) {
            this.router.navigate(['/my-self-assessments']);
            return null;
        } else {
            this.selfAssessmentSelected = self;
            const update: Update = new Update();
            update.navSubTitle = self.name;
            this.dataSharingService.updateLayout(update);
            return this.selfAssessmentSelected;
        }
    }

    setSelfAssessment(selfAssessment: SelfAssessmentMgm) {
        this.selfAssessmentSelected = selfAssessment;
        this.sessionStorage.store(SelfAssessmentMgmService.SELF_ASSESSMENT_KEY, selfAssessment);
    }

    isSelfAssessmentSelected(): boolean {
        const self = this.sessionStorage.retrieve(SelfAssessmentMgmService.SELF_ASSESSMENT_KEY);
        return self !== null && self !== undefined;
    }

    create(selfAssessment: SelfAssessmentMgm): Observable<EntityResponseType> {
        const copy = this.convert(selfAssessment);
        return this.http.post<SelfAssessmentMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(selfAssessment: SelfAssessmentMgm): Observable<EntityResponseType> {
        const copy = this.convert(selfAssessment);

        const self: SelfAssessmentMgm = this.sessionStorage.retrieve(SelfAssessmentMgmService.SELF_ASSESSMENT_KEY);
        if (self && self.id === copy.id) {
            this.sessionStorage.store(SelfAssessmentMgmService.SELF_ASSESSMENT_KEY, copy);
        }

        return this.http.put<SelfAssessmentMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SelfAssessmentMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SelfAssessmentMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<SelfAssessmentMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<SelfAssessmentMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        const self: SelfAssessmentMgm = this.sessionStorage.retrieve(SelfAssessmentMgmService.SELF_ASSESSMENT_KEY);
        if (self && self.id === id) {
            this.sessionStorage.clear(SelfAssessmentMgmService.SELF_ASSESSMENT_KEY);
        }

        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<SelfAssessmentMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<SelfAssessmentMgm[]>(this.resourceSearchUrl, {params: options, observe: 'response'})
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

        copy.created = this.dateUtils.toDate(selfAssessment.created + '');

        copy.modified = this.dateUtils.toDate(selfAssessment.modified + '');
        return copy;
    }

    getSelfAssessmentsByCompanyProfile(companyProfileID: number): Observable<SelfAssessmentMgm[]> {
        return this.http.get<SelfAssessmentMgm[]>(
            this.resourceByCompanyUrl.replace(SelfAssessmentMgmService.COMPANY_PROFILE_KEY, companyProfileID + ''));
    }
}
