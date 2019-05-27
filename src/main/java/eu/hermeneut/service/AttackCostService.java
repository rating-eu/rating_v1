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

package eu.hermeneut.service;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.enumeration.CostType;

import java.util.List;

/**
 * Service Interface for managing AttackCost.
 */
public interface AttackCostService {

    /**
     * Save a attackCost.
     *
     * @param attackCost the entity to save
     * @return the persisted entity
     */
    AttackCost save(AttackCost attackCost);

    List<AttackCost> save(List<AttackCost> attackCosts);

    /**
     * Get all the attackCosts.
     *
     * @return the list of entities
     */
    List<AttackCost> findAll();

    /**
     * Get the "id" attackCost.
     *
     * @param id the id of the entity
     * @return the entity
     */
    AttackCost findOne(Long id);

    /**
     * Delete the "id" attackCost.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    List<AttackCost> findAllUniqueTypesBySelfAssessmentWithNulledID(Long selfAssessmentID);

    List<AttackCost> findAllBySelfAssessmentAndCostTypeWithDuplicateTypes(Long selfAssessmentID, CostType costType);
}
