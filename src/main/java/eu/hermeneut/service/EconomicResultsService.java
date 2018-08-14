package eu.hermeneut.service;

import eu.hermeneut.domain.EconomicResults;
import java.util.List;

/**
 * Service Interface for managing EconomicResults.
 */
public interface EconomicResultsService {

    /**
     * Save a economicResults.
     *
     * @param economicResults the entity to save
     * @return the persisted entity
     */
    EconomicResults save(EconomicResults economicResults);

    /**
     * Get all the economicResults.
     *
     * @return the list of entities
     */
    List<EconomicResults> findAll();

    /**
     * Get the "id" economicResults.
     *
     * @param id the id of the entity
     * @return the entity
     */
    EconomicResults findOne(Long id);

    /**
     * Delete the "id" economicResults.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the economicResults corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<EconomicResults> search(String query);

    EconomicResults findOneBySelfAssessmentID(Long selfAssessmentID);
}
