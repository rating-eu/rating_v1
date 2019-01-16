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
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private WP4StepsService wp4StepsService;

    @Override
    public Status getAssetClusteringStatus(Long selfAssessmentID) {
        Status status = Status.EMPTY;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

            status = !myAssets.isEmpty() ? Status.FULL : Status.EMPTY;
        }

        return status;
    }

    @Override
    public Status getIdentifyThreatAgentsStatus(Long selfAssessmentID) {
        Status status = Status.EMPTY;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findAllBySelfAssessmentAndQuestionnairePurpose(selfAssessmentID, QuestionnairePurpose.ID_THREAT_AGENT).stream().findFirst().orElse(null);

            status = questionnaireStatus != null ? questionnaireStatus.getStatus() : Status.EMPTY;
        }

        return status;
    }

    @Override
    public Status getAssessVulnerabilitiesStatus(Long selfAssessmentID) {
        Status status = Status.EMPTY;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findBySelfAssessmentRoleAndQuestionnairePurpose(selfAssessmentID, Role.ROLE_CISO, QuestionnairePurpose.SELFASSESSMENT);

            status = questionnaireStatus != null ? questionnaireStatus.getStatus() : Status.EMPTY;
        }

        return status;
    }

    @Override
    public Status getRefineVulnerabilitiesStatus(Long selfAssessmentID) {
        Status status = Status.EMPTY;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findBySelfAssessmentRoleAndQuestionnairePurpose(selfAssessmentID, Role.ROLE_EXTERNAL_AUDIT, QuestionnairePurpose.SELFASSESSMENT);

            status = questionnaireStatus != null ? questionnaireStatus.getStatus() : Status.EMPTY;
        }

        return status;
    }

    @Override
    public Status getImpactEvaluationStatus(Long selfAssessmentID) {
        //ImpactEvaluationStatus exists
        Status status = Status.EMPTY;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            try {
                ImpactEvaluationStatus impactEvaluationStatus = this.dashboardService.getImpactEvaluationStatus(selfAssessmentID);

                status = impactEvaluationStatus != null ? Status.FULL : Status.EMPTY;
            } catch (NullInputException e) {
                e.printStackTrace();
            } catch (NotFoundException e) {
                e.printStackTrace();
            }
        }

        return status;
    }

    @Override
    public Status getRiskEvaluationStatus(Long selfAssessmentID) {
        //There exists 1+ MyAsset with impact != null && MyAsset.attackChances.size > 0
        Status status = Status.EMPTY;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

            if (myAssets != null && !myAssets.isEmpty()) {
                for (MyAsset myAsset : myAssets) {
                    if (myAsset.getImpact() != null && myAsset.getImpact() > 0) {
                        try {
                            List<MyAssetAttackChance> myAssetAttackChances = this.wp4StepsService.getAttackChances(selfAssessmentID, myAsset.getId());

                            if (myAssetAttackChances != null && !myAssetAttackChances.isEmpty()) {
                                status = Status.FULL;
                                break;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }

        return status;
    }
}
