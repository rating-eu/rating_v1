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

import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.exceptions.NotFoundException;

import java.util.List;

/**
 * Service Interface for managing AttackCostParam.
 */
public interface AttackCostParamService {

    /**
     * Save a attackCostParam.
     *
     * @param attackCostParam the entity to save
     * @return the persisted entity
     */
    AttackCostParam save(AttackCostParam attackCostParam);

    /**
     * Get all the attackCostParams.
     *
     * @return the list of entities
     */
    List<AttackCostParam> findAll();

    /**
     * Get the "id" attackCostParam.
     *
     * @param id the id of the entity
     * @return the entity
     */
    AttackCostParam findOne(Long id);

    /**
     * Delete the "id" attackCostParam.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    List<AttackCostParam> findAllBySelfAssessment(Long selfAssessmentID) throws NotFoundException;
}
