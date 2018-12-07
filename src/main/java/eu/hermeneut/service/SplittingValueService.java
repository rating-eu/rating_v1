package eu.hermeneut.service;

import eu.hermeneut.domain.SplittingValue;
import java.util.List;

/**
 * Service Interface for managing SplittingValue.
 */
public interface SplittingValueService {

    /**
     * Save a splittingValue.
     *
     * @param splittingValue the entity to save
     * @return the persisted entity
     */
    SplittingValue save(SplittingValue splittingValue);

    /**
     * Get all the splittingValues.
     *
     * @return the list of entities
     */
    List<SplittingValue> findAll();

    /**
     * Get the "id" splittingValue.
     *
     * @param id the id of the entity
     * @return the entity
     */
    SplittingValue findOne(Long id);

    /**
     * Delete the "id" splittingValue.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the splittingValue corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<SplittingValue> search(String query);

    List<SplittingValue> findAllBySelfAssessmentID(Long selfAssessmentID);

    void delete(List<SplittingValue> splittingValues);

    List<SplittingValue> save(List<SplittingValue> splittingValues);
}
