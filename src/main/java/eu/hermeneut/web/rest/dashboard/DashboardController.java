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
    public ImpactEvaluationStatus getSelfAssessmentOverview(@PathVariable Long selfAssessmentID) throws
        NullInputException, NotFoundException {

        try {
            return this.dashboardService.getImpactEvaluationStatus(selfAssessmentID);
        } catch (NullInputException | NotFoundException e) {
            throw e;
        }
    }
}
