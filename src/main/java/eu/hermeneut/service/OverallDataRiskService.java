package eu.hermeneut.service;

import eu.hermeneut.domain.OverallDataRisk;
import eu.hermeneut.domain.OverallSecurityImpact;

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
     * Get the overallDataRisk of the given DataOperation.
     *
     * @param operationID the id of the DataOperation
     * @return the entity
     */
    OverallDataRisk findOneByDataOperation(Long operationID);

    /**
     * Delete the "id" overallDataRisk.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    List<OverallDataRisk> findAllByCompanyProfile(Long companyID);
}
