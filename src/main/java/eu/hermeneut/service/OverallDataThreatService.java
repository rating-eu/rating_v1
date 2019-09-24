package eu.hermeneut.service;

import eu.hermeneut.domain.OverallDataThreat;
import java.util.List;

/**
 * Service Interface for managing OverallDataThreat.
 */
public interface OverallDataThreatService {

    /**
     * Save a overallDataThreat.
     *
     * @param overallDataThreat the entity to save
     * @return the persisted entity
     */
    OverallDataThreat save(OverallDataThreat overallDataThreat);

    /**
     * Get all the overallDataThreats.
     *
     * @return the list of entities
     */
    List<OverallDataThreat> findAll();

    /**
     * Get the "id" overallDataThreat.
     *
     * @param id the id of the entity
     * @return the entity
     */
    OverallDataThreat findOne(Long id);

    /**
     * Delete the "id" overallDataThreat.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
