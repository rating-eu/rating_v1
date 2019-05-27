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

import eu.hermeneut.domain.ImpactLevel;

import java.util.List;

/**
 * Service Interface for managing ImpactLevel.
 */
public interface ImpactLevelService {

    /**
     * Save a impactLevel.
     *
     * @param impactLevel the entity to save
     * @return the persisted entity
     */
    ImpactLevel save(ImpactLevel impactLevel);

    /**
     * Get all the impactLevels.
     *
     * @return the list of entities
     */
    List<ImpactLevel> findAll();

    /**
     * Get the "id" impactLevel.
     *
     * @param id the id of the entity
     * @return the entity
     */
    ImpactLevel findOne(Long id);

    /**
     * Delete the "id" impactLevel.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    List<ImpactLevel> findAllBySelfAssessment(Long selfAssessmentID);

    List<ImpactLevel> saveAll(List<ImpactLevel> impactLevels);

    boolean checkValidity(List<ImpactLevel> impactLevels);
}
