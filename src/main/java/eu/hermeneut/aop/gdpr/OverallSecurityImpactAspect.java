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

package eu.hermeneut.aop.gdpr;

import eu.hermeneut.domain.DataOperation;
import eu.hermeneut.domain.OverallSecurityImpact;
import eu.hermeneut.domain.SecurityImpact;
import eu.hermeneut.domain.enumeration.DataImpact;
import eu.hermeneut.service.OverallSecurityImpactService;
import eu.hermeneut.service.SecurityImpactService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Aspect
@Component
public class OverallSecurityImpactAspect {

    @Autowired
    private OverallSecurityImpactService overallSecurityImpactService;

    /**
     * Pointcut for methods annotated with UpdateImpactsHook.
     */
    @Pointcut("@annotation(eu.hermeneut.aop.annotation.gdpr.OverallSecurityImpactHook)")
    public void updateSecurityImpactsHook() {
    }

    @AfterReturning(pointcut = "updateSecurityImpactsHook()", returning = "result")
    public void updateOverallSecurityImpact(JoinPoint joinPoint, Object result) {
        if (result != null && result instanceof DataOperation) {
            DataOperation dataOperation = (DataOperation) result;

            Set<SecurityImpact> impacts = new HashSet<>(dataOperation.getImpacts());

            if (impacts != null && !impacts.isEmpty()) {
                // Create or Update the OverallSecurityImpact
                OverallSecurityImpact overallSecurityImpact = this.overallSecurityImpactService
                    .findOneByDataOperation(dataOperation.getId());

                DataImpact overallImpact = DataImpact.LOW;

                for (SecurityImpact impact : impacts) {
                    if (impact.getImpact().getImpact() > overallImpact.getImpact()) {
                        overallImpact = impact.getImpact();
                    }
                }

                if (overallSecurityImpact != null) {
                    overallSecurityImpact.setImpacts(impacts);
                    overallSecurityImpact.setImpact(overallImpact);
                } else {
                    overallSecurityImpact = new OverallSecurityImpact();

                    overallSecurityImpact.setOperation(dataOperation);

                    overallSecurityImpact.setImpacts(impacts);
                    overallSecurityImpact.setImpact(overallImpact);
                }

                this.overallSecurityImpactService.save(overallSecurityImpact);
            } else {
                // Delete the existing OverallSecurityImpact if present.
            }
        }
    }
}
