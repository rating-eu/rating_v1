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
import eu.hermeneut.domain.SplittingLoss;

import java.util.List;

/**
 * Service Interface for managing SplittingLoss.
 */
public interface SplittingLossService {

    /**
     * Save a splittingLoss.
     *
     * @param splittingLoss the entity to save
     * @return the persisted entity
     */
    SplittingLoss save(SplittingLoss splittingLoss);

    /**
     * Get all the splittingLosses.
     *
     * @return the list of entities
     */
    List<SplittingLoss> findAll();

    /**
     * Get the "id" splittingLoss.
     *
     * @param id the id of the entity
     * @return the entity
     */
    SplittingLoss findOne(Long id);

    /**
     * Delete the "id" splittingLoss.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    void delete(List<SplittingLoss> splittingLosses);

    /**
     * Search for the splittingLoss corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    List<SplittingLoss> search(String query);

    List<SplittingLoss> findAllBySelfAssessmentID(Long selfAssessmentID);

    SplittingLoss getDATASplittingLossBySelfAssessmentID(Long selfAssessmentID);

    List<SplittingLoss> save(List<SplittingLoss> splittingLosses);
}
