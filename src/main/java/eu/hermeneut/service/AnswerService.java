package eu.hermeneut.service;

import eu.hermeneut.domain.Answer;
import eu.hermeneut.domain.Question;

import java.util.List;

/**
 * Service Interface for managing Answer.
 */
public interface AnswerService {

    /**
     * Save a answer.
     *
     * @param answer the entity to save
     * @return the persisted entity
     */
    Answer save(Answer answer);

    /**
     * Get all the answers.
     *
     * @return the list of entities
     */
    List<Answer> findAll();

    /**
     * Get the "id" answer.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Answer findOne(Long id);

    /**
     * Delete the "id" answer.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the answer corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    List<Answer> search(String query);
}
