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

import eu.hermeneut.domain.Phase;
import java.util.List;

/**
 * Service Interface for managing Phase.
 */
public interface PhaseService {

    /**
     * Save a phase.
     *
     * @param phase the entity to save
     * @return the persisted entity
     */
    Phase save(Phase phase);

    /**
     * Get all the phases.
     *
     * @return the list of entities
     */
    List<Phase> findAll();

    /**
     * Get the "id" phase.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Phase findOne(Long id);

    /**
     * Delete the "id" phase.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the phase corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Phase> search(String query);
}
