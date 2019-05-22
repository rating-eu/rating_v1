import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {SERVER_API_URL} from "../../app.constants";
import {Observable} from "rxjs";
import {MyAssetDto} from "./my-asset-dto";

const SELF_ASSESSMENT_ID_PLACEHOLDER = "{selfAssessmentID}";

@Injectable()
export class MyAssetDtoService {
    private resourceUrl = SERVER_API_URL + 'api/my-assets/dto/self-assessment/{selfAssessmentID}';

    constructor(private http: HttpClient) {

    }

    getAllBySelfAssessment(selfAssessmentID: number): Observable<HttpResponse<MyAssetDto[]>> {
        return this.http.get<MyAssetDto[]>(
            this.resourceUrl.replace(SELF_ASSESSMENT_ID_PLACEHOLDER, String(selfAssessmentID)),
            {observe: 'response'}
        );
    }
}
