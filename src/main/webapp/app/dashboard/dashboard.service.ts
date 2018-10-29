import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MyAnswerMgm } from '../entities/my-answer-mgm';

export interface DashboardStatus {
  assetClusteringStatus: boolean;
  identifyThreatAgentsStatus: boolean;
  assessVulnerablitiesStatus: boolean;
  impactEvaluationStatus: boolean;
  riskEvaluationStatus: boolean;
}

@Injectable()
export class DashboardService {
  private subscribeForStatus: BehaviorSubject<DashboardStatus> = new BehaviorSubject<DashboardStatus>({} as DashboardStatus);

  constructor() { }

  public updateStatus(status: DashboardStatus) {
    this.subscribeForStatus.next(status);
  }

  public getStatus(): DashboardStatus {
    return this.subscribeForStatus.getValue();
  }

  public observeStatus(): Observable<DashboardStatus> {
    return this.subscribeForStatus.asObservable();
  }

}
