import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constants";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Result} from "./models/result.model";
import {Observable} from "rxjs/Observable";

export type EntityResponseType = HttpResponse<Result>;

@Injectable()
export class ResultsService {
    private resourceUrl = SERVER_API_URL + 'api/result';
    private maxLikelihoodUrl = SERVER_API_URL + 'api/likelihood/max';

    constructor(
        private http: HttpClient
    ) {
    }

    getResult(selfAssessmentID: number): Observable<EntityResponseType> {
        return this.http.get<Result>(this.resourceUrl + '/' + selfAssessmentID, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    getMax(): Observable<number> {
        return this.http.get<number>(this.maxLikelihoodUrl, {observe: 'response'})
            .map((res: HttpResponse<number>) => {
                return res.body;
            });
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Result = res.body;

        //Initial Vulnerability Map
        const initialVulnerabilityMap: Map<number, number> = new Map<number, number>();

        Object.keys(body.initialVulnerability)
            .forEach((key: string) => {
                initialVulnerabilityMap.set(Number(key), body.initialVulnerability[key] as number);
            });

        body.initialVulnerability = initialVulnerabilityMap;

        //Contextual Vulnerability Map
        const contextualVulnerabilityMap: Map<number, number> = new Map<number, number>();

        Object.keys(body.contextualVulnerability)
            .forEach((key: string) => {
                contextualVulnerabilityMap.set(Number(key), body.contextualVulnerability[key] as number);
            });

        body.contextualVulnerability = contextualVulnerabilityMap;

        // RefinedVulnerability Map
        const refinedVulnerabilityMap: Map<number, number> = new Map<number, number>();

        Object.keys(body.refinedVulnerability)
            .forEach((key: string) => {
                refinedVulnerabilityMap.set(Number(key), body.refinedVulnerability[key] as number);
            });

        body.refinedVulnerability = refinedVulnerabilityMap;

        return res.clone({body});
    }
}
