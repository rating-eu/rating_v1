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
import eu.hermeneut.domain.GrowthRate;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.wp3.IDE;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.EconomicCoefficientsService;
import eu.hermeneut.service.EconomicResultsService;
import eu.hermeneut.service.GrowthRateService;
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
import java.util.List;

@Aspect
@Component
@Order(3)
public class IntangibleCapitalAspect {

    private final Logger logger = LoggerFactory.getLogger(IntangibleCapitalAspect.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private GrowthRateService growthRateService;

    @Autowired
    private EconomicResultsService economicResultsService;

    @Autowired
    private EconomicCoefficientsService economicCoefficientsService;

    /**
     * Pointcut for methods annotated with UpdateIntangibleCapitalHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.UpdateIntangibleCapitalHook)")
    public void updateIntangibleCapitalHook() {
    }

    /**
     * Cross-cutting method to update the IntangibleCapital of a SelfAssessment.
     *
     * @param joinPoint
     */
    @AfterReturning("updateIntangibleCapitalHook()")
    public void updateIntangibleCapital(JoinPoint joinPoint) {
        logger.debug("Updating IntangibleCapital AOP...");

        SelfAssessment selfAssessment = null;

        Object[] args = joinPoint.getArgs();

        if (args != null && args.length > 0) {
            //The first parameter must be the ID of the SelfAssessment
            if (args[0] instanceof Long) {
                selfAssessment = this.selfAssessmentService.findOne((Long) args[0]);
            }
        }

        if (selfAssessment != null) {
            try {
                List<GrowthRate> growthRates = this.growthRateService.findAllBySelfAssessment(selfAssessment.getId());
                EconomicCoefficients economicCoefficients = this.economicCoefficientsService.findOneBySelfAssessmentID(selfAssessment.getId());
                EconomicResults economicResults = this.economicResultsService.findOneBySelfAssessmentID(selfAssessment.getId());

                if (growthRates != null && economicCoefficients != null && economicResults != null) {
                    BigDecimal intangibleDrivingEarnings = economicResults.getIntangibleDrivingEarnings();
                    BigDecimal discountingRate = economicCoefficients.getDiscountingRate();

                    if (intangibleDrivingEarnings != null && discountingRate != null) {
                        try {
                            List<IDE> ides = Calculator.calculateIDEs(intangibleDrivingEarnings, growthRates);
                            List<IDE> idesTZero = Calculator.calculateIDEsTZero(discountingRate, growthRates, ides);

                            BigDecimal intangibleCapital = Calculator.calculateIntangibleCapital(idesTZero);

                            economicResults.setIntangibleCapital(intangibleCapital);

                            this.economicResultsService.save(economicResults);
                        } catch (IllegalInputException e) {
                            e.printStackTrace();
                        }
                    }
                }
            } catch (NotFoundException e) {//SelfAssessment does not exist
                e.printStackTrace();
            }
        }
    }
}
