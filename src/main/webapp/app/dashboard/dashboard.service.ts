import { SERVER_API_URL } from './../app.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DashboardStepEnum } from './models/enumeration/dashboard-step.enum';
import { SelfAssessmentMgm } from './../entities/self-assessment-mgm/self-assessment-mgm.model';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export enum Status {
  'EMPTY' = 'EMPTY',
  'PENDING' = 'PENDING',
  'FULL' = 'FULL'
}

export interface DashboardStatus {
  assetClusteringStatus: Status;
  identifyThreatAgentsStatus: Status;
  assessVulnerablitiesStatus: Status;
  impactEvaluationStatus: Status;
  riskEvaluationStatus: Status;
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

  public getStatusFromServer(self: SelfAssessmentMgm, requestedStatus: DashboardStepEnum): Observable<string> {
    let uri = this.dashboardStatusUri.replace('{selfAssessmentID}', String(self.id));
    uri = uri.replace('{requestedStatus}', requestedStatus.toString());
    return this.http.get<string>(uri, { observe: 'response' })
      .map((res: HttpResponse<string>) => {
        return res.body;
      });
  }

}
