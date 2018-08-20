package eu.hermeneut.service;

import eu.hermeneut.domain.LikelihoodScale;
import java.util.List;

/**
 * Service Interface for managing LikelihoodScale.
 */
public interface LikelihoodScaleService {

    /**
     * Save a likelihoodScale.
     *
     * @param likelihoodScale the entity to save
     * @return the persisted entity
     */
    LikelihoodScale save(LikelihoodScale likelihoodScale);

    /**
     * Get all the likelihoodScales.
     *
     * @return the list of entities
     */
    List<LikelihoodScale> findAll();

    /**
     * Get the "id" likelihoodScale.
     *
     * @param id the id of the entity
     * @return the entity
     */
    LikelihoodScale findOne(Long id);

    /**
     * Delete the "id" likelihoodScale.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the likelihoodScale corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<LikelihoodScale> search(String query);

    /**
     * Get all the likelihoodScales by SelfAssessment
     *
     * @Param selfAssessmentID the SelfAssessment ID
     * @return the list of entities
     */
    List<LikelihoodScale> findAllBySelfAssessment(Long selfAssessmentID);
}
