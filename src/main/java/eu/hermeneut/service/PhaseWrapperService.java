package eu.hermeneut.service;

import eu.hermeneut.domain.PhaseWrapper;
import java.util.List;

/**
 * Service Interface for managing PhaseWrapper.
 */
public interface PhaseWrapperService {

    /**
     * Save a phaseWrapper.
     *
     * @param phaseWrapper the entity to save
     * @return the persisted entity
     */
    PhaseWrapper save(PhaseWrapper phaseWrapper);

    /**
     * Get all the phaseWrappers.
     *
     * @return the list of entities
     */
    List<PhaseWrapper> findAll();

    /**
     * Get the "id" phaseWrapper.
     *
     * @param id the id of the entity
     * @return the entity
     */
    PhaseWrapper findOne(Long id);

    /**
     * Delete the "id" phaseWrapper.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the phaseWrapper corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<PhaseWrapper> search(String query);
}
