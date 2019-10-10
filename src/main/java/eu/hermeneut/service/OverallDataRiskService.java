package eu.hermeneut.service;

import eu.hermeneut.domain.OverallDataRisk;
import java.util.List;

/**
 * Service Interface for managing OverallDataRisk.
 */
public interface OverallDataRiskService {

    /**
     * Save a overallDataRisk.
     *
     * @param overallDataRisk the entity to save
     * @return the persisted entity
     */
    OverallDataRisk save(OverallDataRisk overallDataRisk);

    /**
     * Get all the overallDataRisks.
     *
     * @return the list of entities
     */
    List<OverallDataRisk> findAll();

    /**
     * Get the "id" overallDataRisk.
     *
     * @param id the id of the entity
     * @return the entity
     */
    OverallDataRisk findOne(Long id);

    /**
     * Delete the "id" overallDataRisk.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
