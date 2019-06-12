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

package eu.hermeneut.service.impl.compact;

import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.compact.input.AssetRisk;
import eu.hermeneut.domain.compact.input.AttackStrategyRisk;
import eu.hermeneut.domain.compact.input.RiskProfile;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.compact.AssetRiskService;
import eu.hermeneut.service.compact.AttackStrategyRiskService;
import eu.hermeneut.service.compact.RiskProfileService;
import eu.hermeneut.service.result.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.Set;

@Service
@Transactional
public class RiskProfileServiceImpl implements RiskProfileService {
    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private AttackStrategyRiskService attackStrategyRiskService;

    @Autowired
    private AssetRiskService assetRiskService;

    @Override
    public RiskProfile getRiskProfile(@NotNull Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID = " + selfAssessmentID + " could NOT be FOUND.");
        }

        //Output
        RiskProfile riskProfile = new RiskProfile();

        riskProfile.setSelfAssessmentID(selfAssessmentID);

        riskProfile.setSelfAssessmentName(selfAssessment.getName());

        CompanyProfile companyProfile = selfAssessment.getCompanyProfile();

        if (companyProfile != null) {
            riskProfile.setCompanyID(companyProfile.getId());
            riskProfile.setCompanyName(companyProfile.getName());
        }

        //OK
        try {
            Set<AssetRisk> assetRisks = this.assetRiskService.getAssetRisks(selfAssessmentID);
            riskProfile.setAssetRisks(assetRisks);
        } catch (NotFoundException e) {
            e.printStackTrace();
        }

        //OK
        try {
            final Set<AttackStrategyRisk> attackStrategyRisks = this.attackStrategyRiskService.getAttackStrategyRisks(selfAssessmentID);
            riskProfile.setAttackStrategyRisks(attackStrategyRisks);
        } catch (NotFoundException e) {
            e.printStackTrace();
        }

        return riskProfile;
    }
}
