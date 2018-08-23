package eu.hermeneut.service;

import eu.hermeneut.domain.AssetCategory;
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
     * 
     * @return the list of entities
     */
    List<AssetCategory> search(String query);
}
