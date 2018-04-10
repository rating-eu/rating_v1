package eu.hermeneut.service;

import eu.hermeneut.domain.CompanySector;
import java.util.List;

/**
 * Service Interface for managing CompanySector.
 */
public interface CompanySectorService {

    /**
     * Save a companySector.
     *
     * @param companySector the entity to save
     * @return the persisted entity
     */
    CompanySector save(CompanySector companySector);

    /**
     * Get all the companySectors.
     *
     * @return the list of entities
     */
    List<CompanySector> findAll();

    /**
     * Get the "id" companySector.
     *
     * @param id the id of the entity
     * @return the entity
     */
    CompanySector findOne(Long id);

    /**
     * Delete the "id" companySector.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the companySector corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<CompanySector> search(String query);
}
