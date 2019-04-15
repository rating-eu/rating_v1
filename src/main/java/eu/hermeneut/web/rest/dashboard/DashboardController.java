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

import eu.hermeneut.domain.dashboard.ImpactEvaluationStatus;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.DashboardService;
import eu.hermeneut.web.rest.overview.OverviewController;
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
public class DashboardController {

    private static final Logger LOGGER = LoggerFactory.getLogger(OverviewController.class);

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("{selfAssessmentID}/dashboard/impact-evaluation-status")
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public ImpactEvaluationStatus getImpactEvaluationStatus(@PathVariable Long selfAssessmentID) throws
        NullInputException, NotFoundException {

        try {
            return this.dashboardService.getImpactEvaluationStatus(selfAssessmentID);
        } catch (NullInputException | NotFoundException e) {
            throw e;
        }
    }
}
