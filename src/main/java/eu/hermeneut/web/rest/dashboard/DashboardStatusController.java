package eu.hermeneut.web.rest.dashboard;

import eu.hermeneut.domain.dashboard.DashboardStep;
import eu.hermeneut.service.DashboardStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
    public boolean getDashboardStepStatus(@PathVariable Long selfAssessmentID, @PathVariable DashboardStep step) {
        LOGGER.info("GET Dashboard Step Status");
        LOGGER.info("SelfAssessmentID: " + selfAssessmentID);
        LOGGER.info("Step: " + step);

        switch (step) {
            case ASSET_CLUSTERING: {
                return this.statusService.isAssetClusteringDone(selfAssessmentID);
            }
            case IDENTIFY_THREAT_AGENTS: {
                return this.statusService.isIdentifyThreatAgentsDone(selfAssessmentID);
            }
            case ASSESS_VULNERABILITIES: {
                return this.statusService.isAssessVulnerabilitiesDone(selfAssessmentID);
            }
            case REFINE_VULNERABILITIES: {
                return this.statusService.isRefineVulnerabilitiesDone(selfAssessmentID);
            }
            case IMPACT_EVALUATION: {
                return this.statusService.isImpactEvaluationDone(selfAssessmentID);
            }
            case RISK_EVALUATION: {
                return this.statusService.isRiskEvaluationDone(selfAssessmentID);
            }
            default: {
                return false;
            }
        }
    }
}
