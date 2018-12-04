package eu.hermeneut.service.impl;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DashboardStatusServiceImpl implements DashboardStatusService {
    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private DirectAssetService directAssetService;

    @Autowired
    private IndirectAssetService indirectAssetService;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Override
    public boolean isAssetClusteringDone(Long selfAssessmentID) {
        boolean isDone = false;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

            isDone = !myAssets.isEmpty();
        }

        return isDone;
    }

    @Override
    public boolean isIdentifyThreatAgentsDone(Long selfAssessmentID) {
        boolean isDone = false;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findAllBySelfAssessmentAndQuestionnairePurpose(selfAssessmentID, QuestionnairePurpose.ID_THREAT_AGENT).stream().findFirst().orElse(null);

            isDone = questionnaireStatus != null && questionnaireStatus.getStatus().equals(Status.FULL);
        }

        return isDone;
    }

    @Override
    public boolean isAssessVulnerabilitiesDone(Long selfAssessmentID) {
        boolean isDone = false;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findBySelfAssessmentRoleAndQuestionnairePurpose(selfAssessmentID, Role.ROLE_CISO, QuestionnairePurpose.SELFASSESSMENT);

            isDone = questionnaireStatus != null && questionnaireStatus.getStatus().equals(Status.FULL);
        }

        return isDone;
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
