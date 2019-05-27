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

import eu.hermeneut.domain.ImpactLevelDescription;
import java.util.List;

/**
 * Service Interface for managing ImpactLevelDescription.
 */
public interface ImpactLevelDescriptionService {

    /**
     * Save a impactLevelDescription.
     *
     * @param impactLevelDescription the entity to save
     * @return the persisted entity
     */
    ImpactLevelDescription save(ImpactLevelDescription impactLevelDescription);

    /**
     * Get all the impactLevelDescriptions.
     *
     * @return the list of entities
     */
    List<ImpactLevelDescription> findAll();

    /**
     * Get the "id" impactLevelDescription.
     *
     * @param id the id of the entity
     * @return the entity
     */
    ImpactLevelDescription findOne(Long id);

    /**
     * Delete the "id" impactLevelDescription.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
