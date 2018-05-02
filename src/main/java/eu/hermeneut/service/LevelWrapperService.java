package eu.hermeneut.service;

import eu.hermeneut.domain.LevelWrapper;
import java.util.List;

/**
 * Service Interface for managing LevelWrapper.
 */
public interface LevelWrapperService {

    /**
     * Save a levelWrapper.
     *
     * @param levelWrapper the entity to save
     * @return the persisted entity
     */
    LevelWrapper save(LevelWrapper levelWrapper);

    /**
     * Get all the levelWrappers.
     *
     * @return the list of entities
     */
    List<LevelWrapper> findAll();

    /**
     * Get the "id" levelWrapper.
     *
     * @param id the id of the entity
     * @return the entity
     */
    LevelWrapper findOne(Long id);

    /**
     * Delete the "id" levelWrapper.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the levelWrapper corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<LevelWrapper> search(String query);
}
