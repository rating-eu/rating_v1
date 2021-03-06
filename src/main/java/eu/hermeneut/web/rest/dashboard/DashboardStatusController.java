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

import eu.hermeneut.domain.dashboard.DashboardStep;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.DashboardStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardStatusController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DashboardStatusController.class);

    @Autowired
    private DashboardStatusService statusService;

    @GetMapping("{selfAssessmentID}/dashboard/status/{step}")
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public Status getDashboardStepStatus(@PathVariable Long selfAssessmentID, @PathVariable DashboardStep step) {
        LOGGER.info("GET Dashboard Step Status");
        LOGGER.info("SelfAssessmentID: " + selfAssessmentID);
        LOGGER.info("Step: " + step);

        switch (step) {
            case ASSET_CLUSTERING: {
                return this.statusService.getAssetClusteringStatus(selfAssessmentID);
            }
            case IDENTIFY_THREAT_AGENTS: {
                return this.statusService.getIdentifyThreatAgentsStatus(selfAssessmentID);
            }
            case ASSESS_VULNERABILITIES: {
                return this.statusService.getAssessVulnerabilitiesStatus(selfAssessmentID);
            }
            case REFINE_VULNERABILITIES: {
                return this.statusService.getRefineVulnerabilitiesStatus(selfAssessmentID);
            }
            case IMPACT_EVALUATION: {
                return this.statusService.getImpactEvaluationStatus(selfAssessmentID);
            }
            case RISK_EVALUATION: {
                return this.statusService.getRiskEvaluationStatus(selfAssessmentID);
            }
            case ATTACK_RELATED_COSTS: {
                return this.statusService.getAttackRelatedCostsStatus(selfAssessmentID);
            }
            default: {
                return Status.EMPTY;
            }
        }
    }
}
