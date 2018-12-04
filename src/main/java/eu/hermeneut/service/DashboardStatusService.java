package eu.hermeneut.service;

public interface DashboardStatusService {
    boolean isAssetClusteringDone(Long selfAssessmentID);

    boolean isIdentifyThreatAgentsDone(Long selfAssessmentID);

    boolean isAssessVulnerabilitiesDone(Long selfAssessmentID);

    boolean isRefineVulnerabilitiesDone(Long selfAssessmentID);

    boolean isImpactEvaluationDone(Long selfAssessmentID);

    boolean isRiskEvaluationDone(Long selfAssessmentID);
}
