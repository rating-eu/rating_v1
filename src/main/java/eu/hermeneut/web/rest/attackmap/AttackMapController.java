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

package eu.hermeneut.web.rest.attackmap;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AttackCKC7Matrix;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.web.rest.AssetResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * REST controller for managing the AttackMap.
 */
@RestController
@RequestMapping("/api")
public class AttackMapController {

    private final Logger log = LoggerFactory.getLogger(AssetResource.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

    @GetMapping("/{selfAssessmentID}/attack-matrix")
    public AttackCKC7Matrix getAttackMatrix(@PathVariable Long selfAssessmentID) throws NotFoundException {
        //#1 fetch the SelfAssessment
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID: " + selfAssessmentID + "NOT FOUND!");
        }

        //Map used to update the likelihood of an AttackStrategy in time O(1).
        Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap =
            this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessment.getCompanyProfile().getId());

        AttackCKC7Matrix attackMatrix = new AttackCKC7Matrix(augmentedAttackStrategyMap);

        return attackMatrix;
    }
}
