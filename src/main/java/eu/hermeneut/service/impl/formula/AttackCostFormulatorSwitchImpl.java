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

package eu.hermeneut.service.impl.formula;

import eu.hermeneut.aop.annotation.CostQualifier;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.domain.formula.AttackCostFormula;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AttackCostParamService;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.formula.AttackCostFormulator;
import eu.hermeneut.service.formula.AttackCostFormulatorSwitch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.List;

@Service
@Transactional
public class AttackCostFormulatorSwitchImpl implements AttackCostFormulatorSwitch {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    @CostQualifier(type = CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS)
    private AttackCostFormulator postBreachCustomerProtection;

    @Autowired
    @CostQualifier(type = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS)
    private AttackCostFormulator customerBreachNotificationCosts;

    @Autowired
    @CostQualifier(type = CostType.COST_OF_IT_DOWNTIME)
    private AttackCostFormulator costOfITDowntime;

    @Autowired
    private AttackCostParamService attackCostParamService;

    @Override
    public AttackCostFormula formulateCost(@NotNull Long selfAssessmentID, @NotNull AttackCost attackCost) throws NotFoundException, IllegalInputException {
        List<AttackCostParam> params = this.attackCostParamService.findAllBySelfAssessment(selfAssessmentID);

        switch (attackCost.getType()) {
            case POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS: {
                AttackCostFormula formula = this.postBreachCustomerProtection.formulate(params);
                return formula;
            }
            case CUSTOMER_BREACH_NOTIFICATION_COSTS: {
                AttackCostFormula formula = this.customerBreachNotificationCosts.formulate(params);
                return formula;
            }
            case COST_OF_IT_DOWNTIME: {
                AttackCostFormula formula = this.costOfITDowntime.formulate(params);
                return formula;
            }
            default: {
                AttackCostFormula formula = new AttackCostFormula();
                formula.setAttackCost(attackCost);
                formula.setAttackCostParams(null);
                formula.setFormula(null);

                return formula;
            }
        }
    }
}
