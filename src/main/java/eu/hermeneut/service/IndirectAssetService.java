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

import eu.hermeneut.domain.IndirectAsset;
import java.util.List;

/**
 * Service Interface for managing IndirectAsset.
 */
public interface IndirectAssetService {

    /**
     * Save a indirectAsset.
     *
     * @param indirectAsset the entity to save
     * @return the persisted entity
     */
    IndirectAsset save(IndirectAsset indirectAsset);

    /**
     * Get all the indirectAssets.
     *
     * @return the list of entities
     */
    List<IndirectAsset> findAll();

    /**
     * Get the "id" indirectAsset.
     *
     * @param id the id of the entity
     * @return the entity
     */
    IndirectAsset findOne(Long id);

    /**
     * Delete the "id" indirectAsset.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the indirectAsset corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<IndirectAsset> search(String query);

    List<IndirectAsset> findAllByDirectAsset(Long directAssetID);

    List<IndirectAsset> findAllBySelfAssessment(Long selfAssessmentID);
}
