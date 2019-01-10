import { SERVER_API_URL } from './../app.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DashboardStepEnum } from './models/enumeration/dashboard-step.enum';
import { SelfAssessmentMgm } from './../entities/self-assessment-mgm/self-assessment-mgm.model';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface DashboardStatus {
  assetClusteringStatus: boolean;
  identifyThreatAgentsStatus: boolean;
  assessVulnerablitiesStatus: boolean;
  impactEvaluationStatus: boolean;
  riskEvaluationStatus: boolean;
}

@Injectable()
export class DashboardService {
  private dashboardStatusUri = SERVER_API_URL + 'api/{selfAssessmentID}/dashboard/status/{requestedStatus}';
  private subscribeForStatus: BehaviorSubject<DashboardStatus> = new BehaviorSubject<DashboardStatus>({} as DashboardStatus);

  constructor(
    private http: HttpClient
  ) { }

  public updateStatus(status: DashboardStatus) {
    this.subscribeForStatus.next(status);
  }

  public getStatus(): DashboardStatus {
    return this.subscribeForStatus.getValue();
  }

  public observeStatus(): Observable<DashboardStatus> {
    return this.subscribeForStatus.asObservable();
  }

  public getStatusFromServer(self: SelfAssessmentMgm, requestedStatus: DashboardStepEnum): Observable<boolean> {
    let uri = this.dashboardStatusUri.replace('{selfAssessmentID}', String(self.id));
    uri = uri.replace('{requestedStatus}', requestedStatus.toString());
    return this.http.get<boolean>(uri, { observe: 'response' })
      .map((res: HttpResponse<boolean>) => {
        return res.body;
      });
  }

}
