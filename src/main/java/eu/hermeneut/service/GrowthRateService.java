package eu.hermeneut.service;

import eu.hermeneut.domain.GrowthRate;

import java.util.List;

public interface GrowthRateService {
    /**
     * Save a GrowthRate.
     *
     * @param growthRate the entity to save
     * @return the persisted entity
     */
    GrowthRate save(GrowthRate growthRate);

    /**
     * Save all the GrowthRates.
     *
     * @param growthRates the entities to save
     * @return the persisted entity
     */
    List<GrowthRate> saveAll(List<GrowthRate> growthRates);

    /**
     * Get all the GrowthRates.
     *
     * @return the list of entities
     */
    List<GrowthRate> findAll();

    /**
     * Get the "id" GrowthRate.
     *
     * @param id the id of the entity
     * @return the entity
     */
    GrowthRate findOne(Long id);

    /**
     * Delete the "id" GrowthRate.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Get all the GrowthRates by SelfAssessment.
     *
     * @return the list of entities of the SelfAssessment
     */
    List<GrowthRate> findAllBySelfAssessment(Long selfAssessmentID);
}
