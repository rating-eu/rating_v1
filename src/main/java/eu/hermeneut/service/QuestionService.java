package eu.hermeneut.service;

import eu.hermeneut.domain.Question;
import eu.hermeneut.domain.Questionnaire;

import java.util.List;

/**
 * Service Interface for managing Question.
 */
public interface QuestionService {

    /**
     * Save a question.
     *
     * @param question the entity to save
     * @return the persisted entity
     */
    Question save(Question question);

    /**
     * Get all the questions.
     *
     * @return the list of entities
     */
    List<Question> findAll();
    /**
     * Get all the QuestionDTO where Myanswer is null.
     *
     * @return the list of entities
     */
    List<Question> findAllWhereMyanswerIsNull();

    /**
     * Get the "id" question.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Question findOne(Long id);

    /**
     * Delete the "id" question.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the question corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<Question> search(String query);

    /**
     * Get all the questions by questionnaire.
     *
     * @return the list of entities
     */
    List<Question> findAllByQuestionnaire(Questionnaire questionnaire);
}
