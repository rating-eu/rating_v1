import {Injectable} from "@angular/core";
import {SERVER_API_URL} from "../../app.constants";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {CriticalAttackStrategy} from "./critical-attack-strategy.model";

@Injectable()
export class CriticalAttackStrategyService {
    private selfAssessmentIDPlaceholder = '{selfAssessmentID}';
    private criticalAttackStrategiesURL = SERVER_API_URL + 'api/' + this.selfAssessmentIDPlaceholder + '/critical-attack-strategies';

    constructor(
        private http: HttpClient
    ) {
    }

    public getCriticalAttackStrategies(selfAssessmentID: number): Observable<CriticalAttackStrategy[]> {
        return this.http.get<CriticalAttackStrategy[]>(
            this.criticalAttackStrategiesURL
                .replace(this.selfAssessmentIDPlaceholder, String(selfAssessmentID))
        )
    }
}
