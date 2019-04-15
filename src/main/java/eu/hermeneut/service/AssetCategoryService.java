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

import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.domain.enumeration.AssetType;

import java.util.List;

/**
 * Service Interface for managing AssetCategory.
 */
public interface AssetCategoryService {

    /**
     * Save a assetCategory.
     *
     * @param assetCategory the entity to save
     * @return the persisted entity
     */
    AssetCategory save(AssetCategory assetCategory);

    /**
     * Get all the assetCategories.
     *
     * @return the list of entities
     */
    List<AssetCategory> findAll();

    /**
     * Get the "id" assetCategory.
     *
     * @param id the id of the entity
     * @return the entity
     */
    AssetCategory findOne(Long id);

    /**
     * Delete the "id" assetCategory.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the assetCategory corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    List<AssetCategory> search(String query);

    /**
     * Get all the assetCategories with the specified AssetType..
     *
     * @param assetType the type of the assets to load.
     * @return the list of entities
     */
    List<AssetCategory> findAllByAssetType(AssetType assetType);
}
