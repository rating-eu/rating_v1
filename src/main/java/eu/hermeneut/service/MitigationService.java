package eu.hermeneut.service;

import eu.hermeneut.domain.Mitigation;
import java.util.List;

/**
 * Service Interface for managing Mitigation.
 */
public interface MitigationService {

    /**
     * Save a mitigation.
     *
     * @param mitigation the entity to save
     * @return the persisted entity
     */
    Mitigation save(Mitigation mitigation);

    /**
     * Get all the mitigations.
     *
     * @return the list of entities
     */
    List<Mitigation> findAll();

    /**
     * Get the "id" mitigation.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Mitigation findOne(Long id);

    /**
     * Delete the "id" mitigation.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the mitigation corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Mitigation> search(String query);
}
