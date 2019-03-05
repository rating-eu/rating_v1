package eu.hermeneut.service;

import eu.hermeneut.domain.GrowthRate;
import eu.hermeneut.exceptions.NotFoundException;

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
     * Returns the existing GrowthRates or creates the DEFAULT GrowthRates for the given SelfAssessment.
     *
     * @param selfAssessmentID the SelfAssessment for which to get the GrowthRates.
     * @return Returns the existing GrowthRates or creates the DEFAULT GrowthRates for the given SelfAssessment.
     * @throws NotFoundException if the SelfAssessment does NOT Exist!!!
     */
    List<GrowthRate> findAllBySelfAssessment(Long selfAssessmentID) throws NotFoundException;
}
