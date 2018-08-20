package eu.hermeneut.service;

import eu.hermeneut.domain.CriticalLevel;
import java.util.List;

/**
 * Service Interface for managing CriticalLevel.
 */
public interface CriticalLevelService {

    /**
     * Save a criticalLevel.
     *
     * @param criticalLevel the entity to save
     * @return the persisted entity
     */
    CriticalLevel save(CriticalLevel criticalLevel);

    /**
     * Get all the criticalLevels.
     *
     * @return the list of entities
     */
    List<CriticalLevel> findAll();

    /**
     * Get the "id" criticalLevel.
     *
     * @param id the id of the entity
     * @return the entity
     */
    CriticalLevel findOne(Long id);

    /**
     * Delete the "id" criticalLevel.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the criticalLevel corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<CriticalLevel> search(String query);
}
