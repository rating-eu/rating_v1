/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
export class RiskBoardService {
    private dashboardStatusUri = SERVER_API_URL + 'api/{selfAssessmentID}/riskboard/status/{requestedStatus}';
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

    public getDashboardStatus(): DashboardStatus {
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
