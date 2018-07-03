import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constants";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Result} from "./models/result.model";

export type EntityResponseType = HttpResponse<Result>;

@Injectable()
export class ResultsService {
    private resourceUrl = SERVER_API_URL + 'api/result';

    constructor(
        private http: HttpClient
    ) {
    }

    getResult(selfAssessmentID: number) {
        return this.http.get<Result>(`${this.resourceUrl}/${selfAssessmentID}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Result = res.body;
        return res.clone({body});
    }
}
