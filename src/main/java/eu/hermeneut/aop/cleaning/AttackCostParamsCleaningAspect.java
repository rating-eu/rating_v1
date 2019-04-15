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

package eu.hermeneut.aop.cleaning;

import eu.hermeneut.aop.annotation.CostQualifier;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.attack.cost.AttackCostCleaner;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Aspect
@Component
public class AttackCostParamsCleaningAspect {
    private final Logger logger = LoggerFactory.getLogger(AttackCostParamsCleaningAspect.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    @CostQualifier(type = CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS)
    private AttackCostCleaner postBreachCustomerProtection;

    @Autowired
    @CostQualifier(type = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS)
    private AttackCostCleaner customerBreachNotificationCosts;

    @Autowired
    @CostQualifier(type = CostType.COST_OF_IT_DOWNTIME)
    private AttackCostCleaner costOfITDowntime;

    /**
     * Pointcut for methods annotated with AttackCostParamsCleaningHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.AttackCostParamsCleaningHook)")
    public void attackCostParamsCleaningHook() {
    }

    /**
     * Cross-cutting method to delete AttackCostParams for AttackCosts no longer used.
     *
     * @param joinPoint
     */
    @AfterReturning("attackCostParamsCleaningHook()")
    public void cleanAttackCostParams(JoinPoint joinPoint) {
        logger.debug("Cleaning AttackCostParams AOP...");

        SelfAssessment selfAssessment = null;
        Object[] args = joinPoint.getArgs();

        if (args != null && args.length > 0) {
            //The first parameter must be the ID of the SelfAssessment
            if (args[0] instanceof Long) {
                selfAssessment = this.selfAssessmentService.findOne((Long) args[0]);
            }//or the list of the ImpactLevels
            else if (args[0] instanceof MyAsset) {
                MyAsset myAsset = (MyAsset) args[0];

                if (myAsset != null) {
                    selfAssessment = myAsset.getSelfAssessment();
                }
            }
        }

        if (selfAssessment != null) {
            List<AttackCost> uniqueAttackCosts = this.attackCostService.findAllUniqueTypesBySelfAssessmentWithNulledID(selfAssessment.getId());
            final SelfAssessment assessment = selfAssessment;

            if (uniqueAttackCosts != null && !uniqueAttackCosts.isEmpty()) {

                List<CostType> allCostTypes = new ArrayList<>(Arrays.asList(CostType.values()));
                List<CostType> identifiedCostTypes = uniqueAttackCosts.stream().parallel().map(AttackCost::getType).collect(Collectors.toList());

                if (allCostTypes.removeAll(identifiedCostTypes)) {//Clean the params of the unused CostTypes
                    allCostTypes.stream().parallel().forEach(costType -> {
                        switch (costType) {
                            case COST_OF_IT_DOWNTIME: {
                                this.costOfITDowntime.clean(assessment);
                                break;
                            }
                            case CUSTOMER_BREACH_NOTIFICATION_COSTS: {
                                this.customerBreachNotificationCosts.clean(assessment);
                                break;
                            }
                            case POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS: {
                                this.postBreachCustomerProtection.clean(assessment);
                                break;
                            }
                        }
                    });
                }
            }
        }
    }
}
