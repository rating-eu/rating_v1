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

import eu.hermeneut.domain.SplittingValue;
import java.util.List;

/**
 * Service Interface for managing SplittingValue.
 */
public interface SplittingValueService {

    /**
     * Save a splittingValue.
     *
     * @param splittingValue the entity to save
     * @return the persisted entity
     */
    SplittingValue save(SplittingValue splittingValue);

    /**
     * Get all the splittingValues.
     *
     * @return the list of entities
     */
    List<SplittingValue> findAll();

    /**
     * Get the "id" splittingValue.
     *
     * @param id the id of the entity
     * @return the entity
     */
    SplittingValue findOne(Long id);

    /**
     * Delete the "id" splittingValue.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the splittingValue corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<SplittingValue> search(String query);

    List<SplittingValue> findAllBySelfAssessmentID(Long selfAssessmentID);

    void delete(List<SplittingValue> splittingValues);

    List<SplittingValue> save(List<SplittingValue> splittingValues);
}
