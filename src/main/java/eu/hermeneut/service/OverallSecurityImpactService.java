package eu.hermeneut.service;

import eu.hermeneut.domain.OverallSecurityImpact;
import java.util.List;

/**
 * Service Interface for managing OverallSecurityImpact.
 */
public interface OverallSecurityImpactService {

    /**
     * Save a overallSecurityImpact.
     *
     * @param overallSecurityImpact the entity to save
     * @return the persisted entity
     */
    OverallSecurityImpact save(OverallSecurityImpact overallSecurityImpact);

    /**
     * Get all the overallSecurityImpacts.
     *
     * @return the list of entities
     */
    List<OverallSecurityImpact> findAll();

    /**
     * Get the "id" overallSecurityImpact.
     *
     * @param id the id of the entity
     * @return the entity
     */
    OverallSecurityImpact findOne(Long id);

    /**
     * Delete the "id" overallSecurityImpact.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
