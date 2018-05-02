package eu.hermeneut.service;

import eu.hermeneut.domain.AnswerWeight;
import java.util.List;

/**
 * Service Interface for managing AnswerWeight.
 */
public interface AnswerWeightService {

    /**
     * Save a answerWeight.
     *
     * @param answerWeight the entity to save
     * @return the persisted entity
     */
    AnswerWeight save(AnswerWeight answerWeight);

    /**
     * Get all the answerWeights.
     *
     * @return the list of entities
     */
    List<AnswerWeight> findAll();

    /**
     * Get the "id" answerWeight.
     *
     * @param id the id of the entity
     * @return the entity
     */
    AnswerWeight findOne(Long id);

    /**
     * Delete the "id" answerWeight.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the answerWeight corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<AnswerWeight> search(String query);
}
