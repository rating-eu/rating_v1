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

package eu.hermeneut.web.rest.attacks;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.attacks.CriticalAttackStrategy;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.attacks.CriticalAttackStrategyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CriticalAttackStrategyController {

    @Autowired
    private CriticalAttackStrategyService criticalAttackStrategyService;

    @GetMapping("/{selfAssessmentID}/critical-attack-strategies")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public List<CriticalAttackStrategy> getCriticalAttackStrategies(@PathVariable("selfAssessmentID") Long selfAssessmentID) throws NotFoundException {
        return this.criticalAttackStrategyService.getCriticalAttackStrategies(selfAssessmentID);
    }
}