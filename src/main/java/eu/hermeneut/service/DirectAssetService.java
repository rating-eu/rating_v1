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
}
