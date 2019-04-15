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

package eu.hermeneut.service.impl.attack.cost;

import eu.hermeneut.aop.annotation.CostQualifier;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotImplementedYetException;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.attack.cost.AttackCostCalculator;
import eu.hermeneut.service.attack.cost.AttackCostSwitch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AttackCostSwitchImpl implements AttackCostSwitch {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    @CostQualifier(type = CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS)
    private AttackCostCalculator postBreachCustomerProtection;

    @Autowired
    @CostQualifier(type = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS)
    private AttackCostCalculator customerBreachNotificationCosts;

    @Autowired
    @CostQualifier(type = CostType.COST_OF_IT_DOWNTIME)
    private AttackCostCalculator costOfITDowntime;

    @Override
    public AttackCost calculateCost(Long selfAssessmentID, CostType type, List<AttackCostParam> params) throws IllegalInputException, NotImplementedYetException {

        if (params == null || params.isEmpty()) {
            throw new IllegalInputException("Params CANNOT be NULL or EMPTY!");
        }

        switch (type) {
            case POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS: {
                AttackCost attackCost = this.postBreachCustomerProtection.calculate(params);
                return updateAllSiblingAttackCosts(selfAssessmentID, type, attackCost);
            }
            case CUSTOMER_BREACH_NOTIFICATION_COSTS: {
                AttackCost attackCost = this.customerBreachNotificationCosts.calculate(params);
                return updateAllSiblingAttackCosts(selfAssessmentID, type, attackCost);
            }
            case COST_OF_IT_DOWNTIME: {
                AttackCost attackCost = this.costOfITDowntime.calculate(params);
                return updateAllSiblingAttackCosts(selfAssessmentID, type, attackCost);
            }
            default: {
                throw new NotImplementedYetException("Method to calculate this cost is NOT IMPLEMENTED YET!");
            }
        }
    }

    private AttackCost updateAllSiblingAttackCosts(Long selfAssessmentID, CostType type, AttackCost attackCost) {
        List<AttackCost> costsByType = this.attackCostService.findAllBySelfAssessmentAndCostTypeWithDuplicateTypes(selfAssessmentID, type);

        costsByType.stream().forEach((cost) -> {
            cost.setCosts(attackCost.getCosts());
        });

        this.attackCostService.save(costsByType);

        return attackCost;
    }
}
