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

import eu.hermeneut.domain.DirectAsset;
import java.util.List;

/**
 * Service Interface for managing DirectAsset.
 */
public interface DirectAssetService {

    /**
     * Save a directAsset.
     *
     * @param directAsset the entity to save
     * @return the persisted entity
     */
    DirectAsset save(DirectAsset directAsset);

    /**
     * Get all the directAssets.
     *
     * @return the list of entities
     */
    List<DirectAsset> findAll();

    /**
     * Get the "id" directAsset.
     *
     * @param id the id of the entity
     * @return the entity
     */
    DirectAsset findOne(Long id);

    DirectAsset findOneByMyAssetID(Long selfAssessmentID, Long myAssetID);

    /**
     * Delete the "id" directAsset.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the directAsset corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<DirectAsset> search(String query);

    List<DirectAsset> findAllBySelfAssessment(Long selfAssessmentID);
}
