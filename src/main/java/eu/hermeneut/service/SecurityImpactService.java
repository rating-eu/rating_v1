package eu.hermeneut.service;

import eu.hermeneut.domain.SecurityImpact;
import java.util.List;

/**
 * Service Interface for managing SecurityImpact.
 */
public interface SecurityImpactService {

    /**
     * Save a securityImpact.
     *
     * @param securityImpact the entity to save
     * @return the persisted entity
     */
    SecurityImpact save(SecurityImpact securityImpact);

    /**
     * Get all the securityImpacts.
     *
     * @return the list of entities
     */
    List<SecurityImpact> findAll();

    /**
     * Get the "id" securityImpact.
     *
     * @param id the id of the entity
     * @return the entity
     */
    SecurityImpact findOne(Long id);

    /**
     * Delete the "id" securityImpact.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
