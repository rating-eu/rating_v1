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

import eu.hermeneut.domain.enumeration.dashboard.CompanyBoardStep;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.service.dashboard.CompanyBoardStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CompanyBoardStatusController {

    @Autowired
    private CompanyBoardStatusService companyBoardStatusService;

    @GetMapping("{companyProfileID}/companyboard/status/{step}")
    public Status getCompanyBoardSTepStatus(@PathVariable Long companyProfileID, @PathVariable CompanyBoardStep step) {

        switch (step) {
            case IDENTIFY_THREAT_AGENTS: {
                return this.companyBoardStatusService.getIdentifyThreatAgentsStatus(companyProfileID);
            }
            case ASSESS_VULNERABILITIES: {
                return this.companyBoardStatusService.getAssessVulnerabilitiesStatus(companyProfileID);
            }
            case REFINE_VULNERABILITIES: {
                return this.companyBoardStatusService.getRefineVulnerabilitiesStatus(companyProfileID);
            }
            default: {
                return Status.EMPTY;
            }
        }
    }
}
