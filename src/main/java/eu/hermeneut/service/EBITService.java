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

import eu.hermeneut.domain.EBIT;

import java.util.List;

/**
 * Service Interface for managing EBIT.
 */
public interface EBITService {

    /**
     * Save a eBIT.
     *
     * @param eBIT the entity to save
     * @return the persisted entity
     */
    EBIT save(EBIT eBIT);

    List<EBIT> save(List<EBIT> ebits);

    /**
     * Get all the eBITS.
     *
     * @return the list of entities
     */
    List<EBIT> findAll();

    /**
     * Get the "id" eBIT.
     *
     * @param id the id of the entity
     * @return the entity
     */
    EBIT findOne(Long id);

    /**
     * Delete the "id" eBIT.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Delete the list of EBITs.
     *
     * @param ebits the list of EBITs.
     */
    void delete(List<EBIT> ebits);

    List<EBIT> findAllBySelfAssessment(Long selfAssessmentID);
}
