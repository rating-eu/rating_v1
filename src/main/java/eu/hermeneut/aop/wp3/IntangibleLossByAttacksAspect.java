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

import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.service.EconomicCoefficientsService;
import eu.hermeneut.service.EconomicResultsService;
import eu.hermeneut.service.SelfAssessmentService;
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

@Aspect
@Component
@Order(2)
public class IntangibleLossByAttacksAspect {

    private final Logger logger = LoggerFactory.getLogger(IntangibleLossByAttacksAspect.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private EconomicResultsService economicResultsService;

    @Autowired
    private EconomicCoefficientsService economicCoefficientsService;

    /**
     * Pointcut for methods annotated with UpdateIntangibleLossByAttacksHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.UpdateIntangibleLossByAttacksHook)")
    public void updateIntangibleLossByAttacksHook() {
    }

    /**
     * Cross-cutting method to update the IntangibleLossByAttacks of a SelfAssessment.
     *
     * @param joinPoint
     */
    @AfterReturning("updateIntangibleLossByAttacksHook()")
    public void updateIntangibleLossByAttacks(JoinPoint joinPoint) {
        logger.debug("Updating IntangibleLossByAttacks AOP...");

        SelfAssessment selfAssessment = null;

        Object[] args = joinPoint.getArgs();

        if (args != null && args.length > 0) {
            //The first parameter must be the ID of the SelfAssessment
            if (args[0] instanceof Long) {
                selfAssessment = this.selfAssessmentService.findOne((Long) args[0]);
            }
        }

        if (selfAssessment != null) {
            EconomicCoefficients economicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID(selfAssessment.getId());
            EconomicResults economicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessment.getId());

            if (economicResults != null) {
                BigDecimal intangibleCapital = economicResults.getIntangibleCapital();
                BigDecimal lossOfIntangiblePercentage = economicCoefficients.getLossOfIntangible();

                if (intangibleCapital != null && lossOfIntangiblePercentage != null) {
                    BigDecimal intangibleLossByAttacks = Calculator.calculateIntangibleLossByAttacks(intangibleCapital, lossOfIntangiblePercentage);
                    economicResults.setIntangibleLossByAttacks(intangibleLossByAttacks);

                    this.economicResultsService.save(economicResults);
                }
            }

        }
    }
}
