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

package eu.hermeneut.domain.dashboard;

import eu.hermeneut.domain.enumeration.Status;

public class PrivacyBoardStatus {
    private Status operationDefinition;
    private Status impactEvaluation;
    private Status threatIdentification;
    private Status riskEvaluation;

    public PrivacyBoardStatus() {
        this.operationDefinition = Status.EMPTY;
        this.impactEvaluation = Status.EMPTY;
        this.threatIdentification = Status.EMPTY;
        this.riskEvaluation = Status.EMPTY;
    }

    public PrivacyBoardStatus(Status operationDefinition, Status impactEvaluation, Status threatIdentification, Status riskEvaluation) {
        this.operationDefinition = operationDefinition;
        this.impactEvaluation = impactEvaluation;
        this.threatIdentification = threatIdentification;
        this.riskEvaluation = riskEvaluation;
    }

    public Status getOperationDefinition() {
        return operationDefinition;
    }

    public void setOperationDefinition(Status operationDefinition) {
        this.operationDefinition = operationDefinition;
    }

    public Status getImpactEvaluation() {
        return impactEvaluation;
    }

    public void setImpactEvaluation(Status impactEvaluation) {
        this.impactEvaluation = impactEvaluation;
    }

    public Status getThreatIdentification() {
        return threatIdentification;
    }

    public void setThreatIdentification(Status threatIdentification) {
        this.threatIdentification = threatIdentification;
    }

    public Status getRiskEvaluation() {
        return riskEvaluation;
    }

    public void setRiskEvaluation(Status riskEvaluation) {
        this.riskEvaluation = riskEvaluation;
    }
}
