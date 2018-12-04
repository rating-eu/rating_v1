package eu.hermeneut.service.impl;

import eu.hermeneut.service.DashboardStatusService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DashboardStatusServiceImpl implements DashboardStatusService {
    @Override
    public boolean isAssetClusteringDone(Long selfAssessmentID) {
        return false;
    }

    @Override
    public boolean isIdentifyThreatAgentsDone(Long selfAssessmentID) {
        return false;
    }

    @Override
    public boolean isAssessVulnerabilitiesDone(Long selfAssessmentID) {
        return false;
    }

    @Override
    public boolean isRefineVulnerabilitiesDone(Long selfAssessmentID) {
        return false;
    }

    @Override
    public boolean isImpactEvaluationDone(Long selfAssessmentID) {
        return false;
    }

    @Override
    public boolean isRiskEvaluationDone(Long selfAssessmentID) {
        return false;
    }
}
