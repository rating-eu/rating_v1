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

package eu.hermeneut.web.rest.attack.costs;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotImplementedYetException;
import eu.hermeneut.service.attack.cost.AttackCostSwitch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AttackCostsController {
    private final Logger log = LoggerFactory.getLogger(AttackCostsController.class);

    @Autowired
    private AttackCostSwitch attackCostSwitch;

    @PostMapping("/{selfAssessmentID}/{type}/evaluate-attack-cost")
    @Timed
    @ResponseStatus(HttpStatus.CREATED)
    public AttackCost calculateCost(@PathVariable Long selfAssessmentID, @PathVariable CostType type, @Valid @RequestBody List<AttackCostParam> params) throws IllegalInputException, NotImplementedYetException {
        log.debug("REST request to calculate the cost " + type);

        return this.attackCostSwitch.calculateCost(selfAssessmentID, type, params);
    }
}
