package eu.hermeneut.service;

import eu.hermeneut.domain.SelfAssessment;
import java.util.List;

/**
 * Service Interface for managing SelfAssessment.
 */
public interface SelfAssessmentService {

    /**
     * Save a selfAssessment.
     *
     * @param selfAssessment the entity to save
     * @return the persisted entity
     */
    SelfAssessment save(SelfAssessment selfAssessment);

    /**
     * Get all the selfAssessments.
     *
     * @return the list of entities
     */
    List<SelfAssessment> findAll();

    /**
     * Get the "id" selfAssessment.
     *
     * @param id the id of the entity
     * @return the entity
     */
    SelfAssessment findOne(Long id);

    /**
     * Delete the "id" selfAssessment.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the selfAssessment corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<SelfAssessment> search(String query);
}
