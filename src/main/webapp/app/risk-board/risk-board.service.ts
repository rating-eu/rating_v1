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
import {RiskBoardStepEnum} from '../entities/enumerations/RiskBoardStep.enum';
import {SelfAssessmentMgm} from './../entities/self-assessment-mgm/self-assessment-mgm.model';
import {Injectable} from '@angular/core';
import {Status} from "../entities/enumerations/Status.enum";
import {Observable} from "rxjs";


export class RiskBoardStatus {
    assetClusteringStatus: Status;
    identifyThreatAgentsStatus: Status;
    assessVulnerablitiesStatus: Status;
    refineVulnerablitiesStatus: Status;
    impactEvaluationStatus: Status;
    attackRelatedCostEstimationStatus: Status;
    riskEvaluationStatus: Status;

    constructor() {
        this.assetClusteringStatus = Status.EMPTY;
        this.identifyThreatAgentsStatus = Status.EMPTY;
        this.assessVulnerablitiesStatus = Status.EMPTY;
        this.refineVulnerablitiesStatus = Status.EMPTY;
        this.impactEvaluationStatus = Status.EMPTY;
        this.attackRelatedCostEstimationStatus = Status.EMPTY;
        this.riskEvaluationStatus = Status.EMPTY;
    }
}

@Injectable()
export class RiskBoardService {
    private dashboardStatusUri = SERVER_API_URL + 'api/{selfAssessmentID}/riskboard/status/{requestedStatus}';

    constructor(
        private http: HttpClient
    ) {
    }

    public getStatusFromServer(self: SelfAssessmentMgm, requestedStatus: RiskBoardStepEnum): Observable<Status> {
        let uri = this.dashboardStatusUri.replace('{selfAssessmentID}', String(self.id));
        uri = uri.replace('{requestedStatus}', requestedStatus.toString());
        return this.http.get<Status>(uri, {observe: 'response'})
            .map((res: HttpResponse<Status>) => {
                return res.body;
            });
    }
}
