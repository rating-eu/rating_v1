import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constants";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {CompanyProfileMgm} from "../entities/company-profile-mgm";
import {CompanyBoardStep} from "../entities/enumerations/CompanyBoardStep.enum";
import {Status} from "../entities/enumerations/Status.enum";

const COMPANY_PROFILE_ID_PLACEHOLDER = '{companyProfileID}';

const STEP_PLACEHOLDER = '{step}';

@Injectable()
export class DashboardService {

    private dashboardStatusUrl = SERVER_API_URL + 'api/' + COMPANY_PROFILE_ID_PLACEHOLDER + '/companyboard/status/' + STEP_PLACEHOLDER;

    constructor(
        private http: HttpClient
    ) {
    }

    public getStatusFromServer(companyProfile: CompanyProfileMgm, step: CompanyBoardStep): Observable<HttpResponse<Status>> {
        const url = this.dashboardStatusUrl
            .replace(COMPANY_PROFILE_ID_PLACEHOLDER, String(companyProfile.id))
            .replace(STEP_PLACEHOLDER, CompanyBoardStep[step]);

        return this.http.get<Status>(url, {observe: 'response'});
    }
}
