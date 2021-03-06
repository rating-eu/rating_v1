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

import eu.hermeneut.domain.DomainOfInfluence;
import java.util.List;

/**
 * Service Interface for managing DomainOfInfluence.
 */
public interface DomainOfInfluenceService {

    /**
     * Save a domainOfInfluence.
     *
     * @param domainOfInfluence the entity to save
     * @return the persisted entity
     */
    DomainOfInfluence save(DomainOfInfluence domainOfInfluence);

    /**
     * Get all the domainOfInfluences.
     *
     * @return the list of entities
     */
    List<DomainOfInfluence> findAll();

    /**
     * Get the "id" domainOfInfluence.
     *
     * @param id the id of the entity
     * @return the entity
     */
    DomainOfInfluence findOne(Long id);

    /**
     * Delete the "id" domainOfInfluence.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the domainOfInfluence corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<DomainOfInfluence> search(String query);
}
