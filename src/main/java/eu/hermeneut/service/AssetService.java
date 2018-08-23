package eu.hermeneut.service;

import eu.hermeneut.domain.Asset;
import java.util.List;

/**
 * Service Interface for managing Asset.
 */
public interface AssetService {

    /**
     * Save a asset.
     *
     * @param asset the entity to save
     * @return the persisted entity
     */
    Asset save(Asset asset);

    /**
     * Get all the assets.
     *
     * @return the list of entities
     */
    List<Asset> findAll();

    /**
     * Get the "id" asset.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Asset findOne(Long id);

    /**
     * Delete the "id" asset.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the asset corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Asset> search(String query);
}
