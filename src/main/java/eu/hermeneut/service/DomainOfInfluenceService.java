package eu.hermeneut.service;

import eu.hermeneut.domain.DomainOfInfluence;
import java.util.List;

/**
 * Service Interface for managing DomainOfInfluence.
 */
public interface DomainOfInfluenceService {

    /**
     * Save a domainOfInfluence.
     *
     * @param domainOfInfluence the entity to save
     * @return the persisted entity
     */
    DomainOfInfluence save(DomainOfInfluence domainOfInfluence);

    /**
     * Get all the domainOfInfluences.
     *
     * @return the list of entities
     */
    List<DomainOfInfluence> findAll();

    /**
     * Get the "id" domainOfInfluence.
     *
     * @param id the id of the entity
     * @return the entity
     */
    DomainOfInfluence findOne(Long id);

    /**
     * Delete the "id" domainOfInfluence.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the domainOfInfluence corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<DomainOfInfluence> search(String query);
}
