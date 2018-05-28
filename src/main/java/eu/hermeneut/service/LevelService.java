package eu.hermeneut.service;

import eu.hermeneut.domain.Level;
import java.util.List;

/**
 * Service Interface for managing Level.
 */
public interface LevelService {

    /**
     * Save a level.
     *
     * @param level the entity to save
     * @return the persisted entity
     */
    Level save(Level level);

    /**
     * Get all the levels.
     *
     * @return the list of entities
     */
    List<Level> findAll();

    /**
     * Get the "id" level.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Level findOne(Long id);

    /**
     * Delete the "id" level.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the level corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Level> search(String query);
}
