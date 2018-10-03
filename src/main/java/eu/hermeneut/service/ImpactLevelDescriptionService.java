package eu.hermeneut.service;

import eu.hermeneut.domain.ImpactLevelDescription;
import java.util.List;

/**
 * Service Interface for managing ImpactLevelDescription.
 */
public interface ImpactLevelDescriptionService {

    /**
     * Save a impactLevelDescription.
     *
     * @param impactLevelDescription the entity to save
     * @return the persisted entity
     */
    ImpactLevelDescription save(ImpactLevelDescription impactLevelDescription);

    /**
     * Get all the impactLevelDescriptions.
     *
     * @return the list of entities
     */
    List<ImpactLevelDescription> findAll();

    /**
     * Get the "id" impactLevelDescription.
     *
     * @param id the id of the entity
     * @return the entity
     */
    ImpactLevelDescription findOne(Long id);

    /**
     * Delete the "id" impactLevelDescription.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the impactLevelDescription corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<ImpactLevelDescription> search(String query);
}
