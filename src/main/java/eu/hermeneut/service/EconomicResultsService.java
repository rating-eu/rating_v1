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

import eu.hermeneut.domain.EconomicResults;
import java.util.List;

/**
 * Service Interface for managing EconomicResults.
 */
public interface EconomicResultsService {

    /**
     * Save a economicResults.
     *
     * @param economicResults the entity to save
     * @return the persisted entity
     */
    EconomicResults save(EconomicResults economicResults);

    /**
     * Get all the economicResults.
     *
     * @return the list of entities
     */
    List<EconomicResults> findAll();

    /**
     * Get the "id" economicResults.
     *
     * @param id the id of the entity
     * @return the entity
     */
    EconomicResults findOne(Long id);

    /**
     * Delete the "id" economicResults.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the economicResults corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<EconomicResults> search(String query);

    EconomicResults findOneBySelfAssessmentID(Long selfAssessmentID);
}
