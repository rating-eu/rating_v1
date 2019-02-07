import {SERVER_API_URL} from './../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {DashboardStepEnum} from './models/enumeration/dashboard-step.enum';
import {SelfAssessmentMgm} from './../entities/self-assessment-mgm/self-assessment-mgm.model';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export enum Status {
    'EMPTY' = 'EMPTY',
    'PENDING' = 'PENDING',
    'FULL' = 'FULL'
}

export class DashboardStatus {
    assetClusteringStatus: Status = Status.EMPTY;
    identifyThreatAgentsStatus: Status = Status.EMPTY;
    assessVulnerablitiesStatus: Status = Status.EMPTY;
    refineVulnerablitiesStatus: Status = Status.EMPTY;
    impactEvaluationStatus: Status = Status.EMPTY;
    attackRelatedCostEstimationStatus: Status = Status.EMPTY;
    riskEvaluationStatus: Status = Status.EMPTY;
}

@Injectable()
export class DashboardService {
    private dashboardStatusUri = SERVER_API_URL + 'api/{selfAssessmentID}/dashboard/status/{requestedStatus}';
    private subscribeForStatus: BehaviorSubject<DashboardStatus> = new BehaviorSubject<DashboardStatus>({} as DashboardStatus);
    private dashboardStatus: DashboardStatus = null;

    constructor(
        private http: HttpClient
    ) {
    }

    public updateStepStatus(step: DashboardStepEnum, status: Status) {
        if (!this.dashboardStatus) {
            this.dashboardStatus = new DashboardStatus();
        }

        switch (step) {
            case DashboardStepEnum.ASSET_CLUSTERING: {
                this.dashboardStatus.assetClusteringStatus = status;
                break;
            }
            case DashboardStepEnum.IDENTIFY_THREAT_AGENTS: {
                this.dashboardStatus.identifyThreatAgentsStatus = status;
                break;
            }
            case DashboardStepEnum.ASSESS_VULNERABILITIES: {
                this.dashboardStatus.assessVulnerablitiesStatus = status;
                break;
            }
            case DashboardStepEnum.REFINE_VULNERABILITIES: {
                this.dashboardStatus.refineVulnerablitiesStatus = status;
                break;
            }
            case DashboardStepEnum.IMPACT_EVALUATION: {
                this.dashboardStatus.impactEvaluationStatus = status;
                break;
            }
            case DashboardStepEnum.ATTACK_RELATED_COSTS: {
                this.dashboardStatus.attackRelatedCostEstimationStatus = status;
                break;
            }
            case DashboardStepEnum.RISK_EVALUATION: {
                this.dashboardStatus.riskEvaluationStatus = status;
                break;
            }
        }

        this.subscribeForStatus.next(this.dashboardStatus);
    }

    public getStatus(): DashboardStatus {
        return this.subscribeForStatus.getValue();
    }

    public observeStatus(): Observable<DashboardStatus> {
        return this.subscribeForStatus.asObservable();
    }

    public getStatusFromServer(self: SelfAssessmentMgm, requestedStatus: DashboardStepEnum): Observable<string> {
        let uri = this.dashboardStatusUri.replace('{selfAssessmentID}', String(self.id));
        uri = uri.replace('{requestedStatus}', requestedStatus.toString());
        return this.http.get<string>(uri, {observe: 'response'})
            .map((res: HttpResponse<string>) => {
                return res.body;
            });
    }

}
