package eu.hermeneut.service.impl;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.dashboard.ImpactEvaluationStatus;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.domain.wp4.MyAssetAttackChance;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
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

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private WP4StepsService wp4StepsService;

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

            isDone = questionnaireStatus != null && (questionnaireStatus.getStatus().equals(Status.FULL) || questionnaireStatus.getStatus().equals(Status.PENDING));
        }

        return isDone;
    }

    @Override
    public boolean isAssessVulnerabilitiesDone(Long selfAssessmentID) {
        boolean isDone = false;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findBySelfAssessmentRoleAndQuestionnairePurpose(selfAssessmentID, Role.ROLE_CISO, QuestionnairePurpose.SELFASSESSMENT);

            isDone = questionnaireStatus != null && (questionnaireStatus.getStatus().equals(Status.FULL) || questionnaireStatus.getStatus().equals(Status.PENDING));
        }

        return isDone;
    }

    @Override
    public boolean isRefineVulnerabilitiesDone(Long selfAssessmentID) {
        boolean isDone = false;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findBySelfAssessmentRoleAndQuestionnairePurpose(selfAssessmentID, Role.ROLE_EXTERNAL_AUDIT, QuestionnairePurpose.SELFASSESSMENT);

            isDone = questionnaireStatus != null && (questionnaireStatus.getStatus().equals(Status.FULL) || questionnaireStatus.getStatus().equals(Status.PENDING));
        }

        return isDone;
    }

    @Override
    public boolean isImpactEvaluationDone(Long selfAssessmentID) {
        //ImpactEvaluationStatus exists
        boolean isDone = false;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            try {
                ImpactEvaluationStatus impactEvaluationStatus = this.dashboardService.getImpactEvaluationStatus(selfAssessmentID);

                isDone = impactEvaluationStatus != null;
            } catch (NullInputException e) {
                e.printStackTrace();
            } catch (NotFoundException e) {
                e.printStackTrace();
            }
        }

        return isDone;
    }

    @Override
    public boolean isRiskEvaluationDone(Long selfAssessmentID) {
        //There exists 1+ MyAsset with impact != null && MyAsset.attackChances.size > 0
        boolean isDone = false;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

            if (myAssets != null && !myAssets.isEmpty()) {
                for (MyAsset myAsset : myAssets) {
                    if (myAsset.getImpact() != null && myAsset.getImpact() > 0) {
                        try {
                            List<MyAssetAttackChance> myAssetAttackChances = this.wp4StepsService.getAttackChances(selfAssessmentID, myAsset.getId());

                            if (myAssetAttackChances != null && !myAssetAttackChances.isEmpty()) {
                                isDone = true;
                                break;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }

        return isDone;
    }
}
