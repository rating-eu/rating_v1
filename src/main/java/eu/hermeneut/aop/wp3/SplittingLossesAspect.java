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

package eu.hermeneut.aop.wp3;

import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.SplittingLoss;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.wp3.Calculator;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Aspect
@Component
@Order(1)
public class SplittingLossesAspect {

    private final Logger logger = LoggerFactory.getLogger(SplittingLossesAspect.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private EconomicResultsService economicResultsService;

    @Autowired
    private SplittingLossService splittingLossService;

    /**
     * Pointcut for methods annotated with UpdateSplittingLossesHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.UpdateSplittingValuesHook)")
    public void updateSplittingLossesHook() {
    }

    /**
     * Cross-cutting method to update the SplittingLosses of a SelfAssessment.
     *
     * @param joinPoint
     */
    @AfterReturning("updateSplittingLossesHook()")
    public void updateSplittingLosses(JoinPoint joinPoint) {
        logger.debug("Updating SplittingLosses AOP...");

        SelfAssessment selfAssessment = null;

        Object[] args = joinPoint.getArgs();

        if (args != null && args.length > 0) {
            //The first parameter must be the ID of the SelfAssessment
            if (args[0] instanceof Long) {
                selfAssessment = this.selfAssessmentService.findOne((Long) args[0]);
            }
        }

        if (selfAssessment != null) {
            // GET the existing SplittingLosses for this SelfAssessment and update them.
            List<SplittingLoss> splittingLosses = this.splittingLossService.findAllBySelfAssessmentID(selfAssessment.getId());

            if (splittingLosses != null && !splittingLosses.isEmpty()) {
                EconomicResults economicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessment.getId());

                if (economicResults != null) {
                    BigDecimal intangibleLossByAttacks = economicResults.getIntangibleLossByAttacks();

                    if (intangibleLossByAttacks != null) {
                        for (SplittingLoss splittingLoss : splittingLosses) {
                            final CategoryType categoryType = splittingLoss.getCategoryType();
                            final SectorType sectorType = splittingLoss.getSectorType();

                            if (categoryType != CategoryType.DATA) {
                                BigDecimal loss = Calculator.calculateSplittingLoss(intangibleLossByAttacks, categoryType, sectorType);

                                if (loss != null) {
                                    splittingLoss.setLoss(loss);
                                    splittingLoss = this.splittingLossService.save(splittingLoss);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
