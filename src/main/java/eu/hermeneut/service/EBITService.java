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
     * Search for the eBIT corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<EBIT> search(String query);
}