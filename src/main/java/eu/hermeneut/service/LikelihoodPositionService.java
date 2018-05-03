package eu.hermeneut.service;

import eu.hermeneut.domain.LikelihoodPosition;
import java.util.List;

/**
 * Service Interface for managing LikelihoodPosition.
 */
public interface LikelihoodPositionService {

    /**
     * Save a likelihoodPosition.
     *
     * @param likelihoodPosition the entity to save
     * @return the persisted entity
     */
    LikelihoodPosition save(LikelihoodPosition likelihoodPosition);

    /**
     * Get all the likelihoodPositions.
     *
     * @return the list of entities
     */
    List<LikelihoodPosition> findAll();

    /**
     * Get the "id" likelihoodPosition.
     *
     * @param id the id of the entity
     * @return the entity
     */
    LikelihoodPosition findOne(Long id);

    /**
     * Delete the "id" likelihoodPosition.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the likelihoodPosition corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<LikelihoodPosition> search(String query);
}
