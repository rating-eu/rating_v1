import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constants";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {PrivacyBoardStatus} from "./model/privacy-board-status";

const COMPANY_PROFILE_PLACEHOLDER = '{companyProfileID}';

const OPERATON_PLACEHOLDER = '{operationID}';

@Injectable()
export class PrivacyBoardService {

    // {companyProfileID}/privacy-board/operation/{operationID}/status
    private privacyBoardStatusURL = SERVER_API_URL + 'api/' + COMPANY_PROFILE_PLACEHOLDER + '/privacy-board/operation/' + OPERATON_PLACEHOLDER + '/status';

    constructor(
        private http: HttpClient
    ) {
    }

    public getPrivacyBoardStatus(companyProfileID: number, operationID: number): Observable<HttpResponse<PrivacyBoardStatus>> {
        const url = this.privacyBoardStatusURL
            .replace(COMPANY_PROFILE_PLACEHOLDER, String(companyProfileID))
            .replace(OPERATON_PLACEHOLDER, String(operationID));

        return this.http.get<PrivacyBoardStatus>(url, {observe: 'response'});
    }
}
