import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../../app.constants";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {AssessVulnerabilitiesCompletionDTO} from "./assess-vulnerabilities-completion";

const COMPANY_PROFILE_ID_PLACEHOLDER = '{companyProfileID}';

const QUESTIONNAIRE_STATUS_ID_PLACEHOLDER = '{questionnaireStatusID}';

@Injectable()
export class CompletionDtoService {

    private assessVulnerabilitiesCompletionByCompanyProfileUrl = SERVER_API_URL + 'api/' + COMPANY_PROFILE_ID_PLACEHOLDER + '/completion/vulnerabilities';
    private assessVulnerabilitiesCompletionByCompanyProfileAndQuestionnaireStatusUrl =
        SERVER_API_URL + 'api/' + COMPANY_PROFILE_ID_PLACEHOLDER + '/completion/vulnerabilities/questionnaire-status/' + QUESTIONNAIRE_STATUS_ID_PLACEHOLDER;

    constructor(private http: HttpClient) {

    }

    getAssessVulnerabilitiesCompletionByCompanyProfile(companyProfileID: number): Observable<HttpResponse<AssessVulnerabilitiesCompletionDTO>> {
        return this.http.get<AssessVulnerabilitiesCompletionDTO>(
            this.assessVulnerabilitiesCompletionByCompanyProfileUrl.replace(COMPANY_PROFILE_ID_PLACEHOLDER, String(companyProfileID)),
            {observe: 'response'}
        );
    }

    getAssessVulnerabilitiesCompletionByCompanyProfileAndQuestionnaireStatus(companyProfileID: number, questionnaireStatusID: number): Observable<HttpResponse<AssessVulnerabilitiesCompletionDTO>> {
        return this.http.get<AssessVulnerabilitiesCompletionDTO>(
            this.assessVulnerabilitiesCompletionByCompanyProfileAndQuestionnaireStatusUrl
                .replace(COMPANY_PROFILE_ID_PLACEHOLDER, String(companyProfileID))
                .replace(QUESTIONNAIRE_STATUS_ID_PLACEHOLDER, String(questionnaireStatusID)),
            {observe: 'response'}
        );
    }
}
