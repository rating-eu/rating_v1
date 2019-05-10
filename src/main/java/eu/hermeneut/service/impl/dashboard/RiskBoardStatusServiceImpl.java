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

package eu.hermeneut.service.impl.dashboard;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.dashboard.ImpactEvaluationStatus;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.domain.wp4.MyAssetAttackChance;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.dashboard.RiskBoardStatusService;
import eu.hermeneut.service.wp4.WP4StepsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RiskBoardStatusServiceImpl implements RiskBoardStatusService {
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

    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    private CompanyProfileService companyProfileService;

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

    @Override
    @Transactional(readOnly = true)
    public Status getAttackRelatedCostsStatus(Long selfAssessmentID) {
        Status status = Status.EMPTY;
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment != null) {
            List<AttackCost> attackCosts = this.attackCostService.findAllUniqueTypesBySelfAssessmentWithNulledID(selfAssessmentID);

            if (attackCosts != null && !attackCosts.isEmpty()) {
                List<AttackCost> valuedCosts = attackCosts.stream().filter((attackCost) -> attackCost.getCosts() != null && attackCost.getCosts().compareTo(BigDecimal.ZERO) > 0).collect(Collectors.toList());

                if (valuedCosts != null) {
                    if (valuedCosts.isEmpty()) {//No AttackCost or all with costs=ZERO
                        status = Status.EMPTY;
                    } else if (valuedCosts.size() < attackCosts.size()) {//At least one AttackCost with costs > ZERO
                        status = Status.PENDING;
                    } else if (valuedCosts.size() == attackCosts.size()) {//All the AttackCosts with costs > ZERO
                        status = Status.FULL;
                    }
                }
            }
        }

        return status;
    }
}
