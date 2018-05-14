package eu.hermeneut.service;

import eu.hermeneut.domain.ThreatAgent;
import java.util.List;

/**
 * Service Interface for managing ThreatAgent.
 */
public interface ThreatAgentService {

    /**
     * Save a threatAgent.
     *
     * @param threatAgent the entity to save
     * @return the persisted entity
     */
    ThreatAgent save(ThreatAgent threatAgent);

    /**
     * Get all the threatAgents.
     *
     * @return the list of entities
     */
    List<ThreatAgent> findAll();

    /**
     * Get all the default threatAgents.
     *
     * @return the list of entities
     */
    List<ThreatAgent> findAllDefault();

    /**
     * Get the "id" threatAgent.
     *
     * @param id the id of the entity
     * @return the entity
     */
    ThreatAgent findOne(Long id);

    /**
     * Delete the "id" threatAgent.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the threatAgent corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<ThreatAgent> search(String query);
}
