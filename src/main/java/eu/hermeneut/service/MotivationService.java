package eu.hermeneut.service;

import eu.hermeneut.domain.Motivation;
import java.util.List;

/**
 * Service Interface for managing Motivation.
 */
public interface MotivationService {

    /**
     * Save a motivation.
     *
     * @param motivation the entity to save
     * @return the persisted entity
     */
    Motivation save(Motivation motivation);

    /**
     * Get all the motivations.
     *
     * @return the list of entities
     */
    List<Motivation> findAll();

    /**
     * Get the "id" motivation.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Motivation findOne(Long id);

    /**
     * Delete the "id" motivation.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the motivation corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Motivation> search(String query);
}
