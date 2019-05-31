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

package eu.hermeneut.aop.impact;

import eu.hermeneut.domain.ImpactLevel;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.enumeration.ImpactMode;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.impact.ImpactService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Aspect
@Component
public class ImpactUpdateAspect {
    private final Logger logger = LoggerFactory.getLogger(ImpactUpdateAspect.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private ImpactService impactService;

    /**
     * Pointcut for methods annotated with UpdateImpactsHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.UpdateImpactsHook)")
    public void updateImpactsHook() {
    }

    /**
     * Cross-cutting method to calculate or update the Impacts of the MyAssets.
     *
     * @param joinPoint
     */
    @AfterReturning("updateImpactsHook()")
    public void updateMyAssetsImpact(JoinPoint joinPoint) {
        logger.debug("Updating MyAssets Impact AOP...");

        SelfAssessment selfAssessment = null;

        Object[] args = joinPoint.getArgs();

        if (args != null && args.length > 0) {
            //The first parameter must be the ID of the SelfAssessment
            if (args[0] instanceof Long) {
                selfAssessment = this.selfAssessmentService.findOne((Long) args[0]);
            }//or the list of the ImpactLevels
            else if (args[0] instanceof List) {
                List<?> list = (List) args[0];

                if (!list.isEmpty()) {
                    if (list.get(0) instanceof ImpactLevel) {
                        ImpactLevel level = (ImpactLevel) list.get(0);

                        selfAssessment = this.selfAssessmentService.findOne(level.getSelfAssessmentID());
                    }
                }
            }
        }

        if (selfAssessment != null) {
            if (selfAssessment.getImpactMode().equals(ImpactMode.QUANTITATIVE)) {
                try {
                    this.impactService.calculateEconomicImpacts(selfAssessment.getId());
                } catch (Exception e) {
                    logger.warn(e.getMessage());
                }
            }
        }
    }
}
