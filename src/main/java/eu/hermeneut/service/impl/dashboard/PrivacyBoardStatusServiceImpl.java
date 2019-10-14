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

package eu.hermeneut.service.impl.dashboard;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.dashboard.PrivacyBoardStatus;
import eu.hermeneut.domain.enumeration.SecurityPillar;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.domain.enumeration.ThreatArea;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.dashboard.PrivacyBoardStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional
public class PrivacyBoardStatusServiceImpl implements PrivacyBoardStatusService {

    @Autowired
    private DataOperationService dataOperationService;

    @Autowired
    private OverallSecurityImpactService overallSecurityImpactService;

    @Autowired
    private OverallDataThreatService overallDataThreatService;

    @Autowired
    private OverallDataRiskService overallDataRiskService;

    @Override
    public Status getOperationDefinitionStatus(Long companyProfileID, Long operationID) throws NotFoundException {
        DataOperation operation = checkOperationExistence(companyProfileID, operationID);

        // TODO Improve checks
        if (operation.getName() != null && !operation.getName().isEmpty()) {
            return Status.FULL;
        } else {
            return Status.EMPTY;
        }
    }

    @Override
    public Status getImpactEvaluationStatus(Long companyProfileID, Long operationID) throws NotFoundException {
        DataOperation operation = checkOperationExistence(companyProfileID, operationID);

        Set<SecurityImpact> impacts = operation.getImpacts();
        OverallSecurityImpact overallSecurityImpact = this.overallSecurityImpactService.findOneByDataOperation(operationID);

        if (overallSecurityImpact == null) {
            // Status may be EMPTY or PENDING
            if (impacts == null || impacts.isEmpty()) {
                return Status.EMPTY;
            } else if (impacts.size() != SecurityPillar.values().length) {
                return Status.PENDING;
            } else {
                return Status.FULL;
            }
        } else {
            // TODO Status is FULL but the Overall is missing
            return Status.FULL;
        }
    }

    @Override
    public Status getThreatIdentificationStatus(Long companyProfileID, Long operationID) throws NotFoundException {
        DataOperation operation = checkOperationExistence(companyProfileID, operationID);

        Set<DataThreat> threats = operation.getThreats();
        OverallDataThreat overallDataThreat = this.overallDataThreatService.findOneByDataOperation(operationID);

        if (overallDataThreat == null) {
            // Status may be EMPTY or PENDING
            if (threats == null || threats.isEmpty()) {
                return Status.EMPTY;
            } else if (threats.size() != ThreatArea.values().length) {
                return Status.PENDING;
            } else {
                return Status.FULL;
            }
        } else {
            // Status is FULL
            return Status.FULL;
        }
    }

    @Override
    public Status getRiskEvaluationStatus(Long companyProfileID, Long operationID) throws NotFoundException {
        DataOperation operation = checkOperationExistence(companyProfileID, operationID);

        OverallDataRisk overallDataRisk = this.overallDataRiskService.findOneByDataOperation(operationID);

        if (overallDataRisk != null) {
            return Status.FULL;
        } else {
            return Status.EMPTY;
        }
    }

    @Override
    public PrivacyBoardStatus getPrivacyBoardStatus(Long companyProfileID, Long operationID) throws NotFoundException {
        PrivacyBoardStatus status = new PrivacyBoardStatus();

        status.setOperationDefinition(this.getOperationDefinitionStatus(companyProfileID, operationID));
        status.setImpactEvaluation(this.getImpactEvaluationStatus(companyProfileID, operationID));
        status.setThreatIdentification(this.getThreatIdentificationStatus(companyProfileID, operationID));
        status.setRiskEvaluation(this.getRiskEvaluationStatus(companyProfileID, operationID));

        return status;
    }

    private DataOperation checkOperationExistence(Long companyProfileID, Long operationID) throws NotFoundException {
        DataOperation operation = this.dataOperationService.findOneByCompanyProfileAndOperationID(companyProfileID, operationID);

        if (operation == null) {
            throw new NotFoundException("DataOperation with ID: " + operationID + " not found!");
        }

        return operation;
    }
}
