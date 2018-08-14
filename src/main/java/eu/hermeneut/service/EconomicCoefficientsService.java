package eu.hermeneut.service;

import eu.hermeneut.domain.EconomicCoefficients;
import java.util.List;

/**
 * Service Interface for managing EconomicCoefficients.
 */
public interface EconomicCoefficientsService {

    /**
     * Save a economicCoefficients.
     *
     * @param economicCoefficients the entity to save
     * @return the persisted entity
     */
    EconomicCoefficients save(EconomicCoefficients economicCoefficients);

    /**
     * Get all the economicCoefficients.
     *
     * @return the list of entities
     */
    List<EconomicCoefficients> findAll();

    /**
     * Get the "id" economicCoefficients.
     *
     * @param id the id of the entity
     * @return the entity
     */
    EconomicCoefficients findOne(Long id);

    /**
     * Delete the "id" economicCoefficients.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the economicCoefficients corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<EconomicCoefficients> search(String query);

    EconomicCoefficients findOneBySelfAssessmentID(Long selfAssessmentID);
}
