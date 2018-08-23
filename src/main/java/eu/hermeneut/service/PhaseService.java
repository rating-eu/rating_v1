package eu.hermeneut.service;

import eu.hermeneut.domain.Phase;
import java.util.List;

/**
 * Service Interface for managing Phase.
 */
public interface PhaseService {

    /**
     * Save a phase.
     *
     * @param phase the entity to save
     * @return the persisted entity
     */
    Phase save(Phase phase);

    /**
     * Get all the phases.
     *
     * @return the list of entities
     */
    List<Phase> findAll();

    /**
     * Get the "id" phase.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Phase findOne(Long id);

    /**
     * Delete the "id" phase.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the phase corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Phase> search(String query);
}
