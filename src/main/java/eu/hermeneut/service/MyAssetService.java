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

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.enumeration.AssetType;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.exceptions.NotImplementedYetException;

import java.util.List;

/**
 * Service Interface for managing MyAsset.
 */
public interface MyAssetService {

    /**
     * Save a myAsset.
     *
     * @param myAsset the entity to save
     * @return the persisted entity
     */
    MyAsset save(MyAsset myAsset);

    List<MyAsset> saveAll(List<MyAsset> myAssets);

    /**
     * Get all the myAssets.
     *
     * @return the list of entities
     */
    List<MyAsset> findAll();

    /**
     * Get the "id" myAsset.
     *
     * @param id the id of the entity
     * @return the entity
     */
    MyAsset findOne(Long id);

    MyAsset findOneByIDAndSelfAssessment(Long myAssetID, Long selfAssessmentID);

    /**
     * Delete the "id" myAsset.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the myAsset corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    List<MyAsset> search(String query);

    List<MyAsset> findAllBySelfAssessment(Long selfAssessmentID);

    List<MyAsset> findAllBySelfAssessmentAndAssetType(Long selfAssessmentID, AssetType assetType);

    List<MyAsset> findAllBySelfAssessmentAndCategoryType(Long selfAssessmentID, CategoryType data) throws NotImplementedYetException;
}
