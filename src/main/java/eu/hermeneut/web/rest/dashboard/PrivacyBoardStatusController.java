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

package eu.hermeneut.web.rest.dashboard;

import eu.hermeneut.domain.dashboard.PrivacyBoardStatus;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.domain.enumeration.dashboard.PrivacyBoardStep;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.dashboard.PrivacyBoardStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PrivacyBoardStatusController {
    @Autowired
    private PrivacyBoardStatusService privacyBoardStatusService;

    @GetMapping("{companyProfileID}/privacy-board/operation/{operationID}/status")
    public PrivacyBoardStatus getPrivacyBoardStatus(@PathVariable Long companyProfileID, @PathVariable Long operationID) throws NotFoundException {
        return this.privacyBoardStatusService.getPrivacyBoardStatus(companyProfileID, operationID);
    }

    @GetMapping("{companyProfileID}/privacy-board/operation/{operationID}/status/{step}")
    public Status getPrivacyBoardStepStatus(@PathVariable Long companyProfileID, @PathVariable Long operationID, @PathVariable PrivacyBoardStep step) throws NotFoundException {
        switch (step) {
            case OPERATION_DEFINITION: {
                return this.privacyBoardStatusService.getOperationDefinitionStatus(companyProfileID, operationID);
            }
            case IMPACT_EVALUATION: {
                return this.privacyBoardStatusService.getImpactEvaluationStatus(companyProfileID, operationID);
            }
            case THREAT_IDENTIFICATION: {
                return this.privacyBoardStatusService.getThreatIdentificationStatus(companyProfileID, operationID);
            }
            case RISK_EVALUATION: {
                return this.privacyBoardStatusService.getRiskEvaluationStatus(companyProfileID, operationID);
            }
            default: {
                return Status.EMPTY;
            }
        }
    }
}
