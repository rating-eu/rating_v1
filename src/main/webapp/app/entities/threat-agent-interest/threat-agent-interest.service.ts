import {Injectable} from '@angular/core';
import {MyAssetMgm} from "../my-asset-mgm";
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ThreatAgentInterest} from "./threat-agent-interest.model";
import {SERVER_API_URL} from "../../app.constants";
import {CompanyProfileMgm} from "../company-profile-mgm";

const COMPANY_PROFILE_ID = '{companyProfileID}';

const MY_ASSET_ID = '{myAssetID}';

@Injectable()
export class ThreatAgentInterestService {
    private threatAgentsInterestsByCompanyProfileUrl = SERVER_API_URL + 'api/' + COMPANY_PROFILE_ID + '/threat-agent-interests';
    private threatAgentsInterestsByCompanyProfileAndMyAssetUrl = SERVER_API_URL + 'api/' + COMPANY_PROFILE_ID + '/threat-agent-interests/my-asset/' + MY_ASSET_ID;

    constructor(private http: HttpClient) {
    }

    public getThreatAgentsInterestsByCompanyProfileAndMyAsset(companyProfile: CompanyProfileMgm, myAsset: MyAssetMgm): Observable<ThreatAgentInterest[]> {
        const uri = this.threatAgentsInterestsByCompanyProfileAndMyAssetUrl
            .replace(COMPANY_PROFILE_ID, String(companyProfile.id))
            .replace(MY_ASSET_ID, String(myAsset.id));

        return this.http.get<ThreatAgentInterest[]>(uri, {observe: 'response'})
            .map((res: HttpResponse<ThreatAgentInterest[]>) => {
                return res.body;
            });
    }

    public getThreatAgentsInterestsByCompanyProfile(companyProfile: CompanyProfileMgm): Observable<ThreatAgentInterest[]> {
        const uri = this.threatAgentsInterestsByCompanyProfileUrl
            .replace(COMPANY_PROFILE_ID, String(companyProfile.id));

        return this.http.get<ThreatAgentInterest[]>(uri, {observe: 'response'})
            .map((res: HttpResponse<ThreatAgentInterest[]>) => {
                return res.body;
            });
    }
}
