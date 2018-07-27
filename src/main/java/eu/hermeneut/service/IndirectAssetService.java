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
}
