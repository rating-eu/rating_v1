package eu.hermeneut.service.impl;

import eu.hermeneut.domain.*;
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

    @Override
    public boolean isAssetClusteringDone(Long selfAssessmentID) {
        boolean isDone = false;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);
            List<DirectAsset> directAssets = this.directAssetService.findAllBySelfAssessment(selfAssessmentID);
            List<IndirectAsset> indirectAssets = this.indirectAssetService.findAllBySelfAssessment(selfAssessmentID);

            isDone = !(myAssets.isEmpty() || directAssets.isEmpty() || indirectAssets.isEmpty());
        }

        return isDone;
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
