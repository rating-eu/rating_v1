package eu.hermeneut.service;

import eu.hermeneut.domain.enumeration.Status;

public interface DashboardStatusService {
    Status getAssetClusteringStatus(Long selfAssessmentID);

    Status getIdentifyThreatAgentsStatus(Long selfAssessmentID);

    Status getAssessVulnerabilitiesStatus(Long selfAssessmentID);

    Status getRefineVulnerabilitiesStatus(Long selfAssessmentID);

    Status getImpactEvaluationStatus(Long selfAssessmentID);

    Status getRiskEvaluationStatus(Long selfAssessmentID);

    Status getAttackRelatedCostsStatus(Long selfAssessmentID);
}
