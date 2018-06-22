package eu.hermeneut.service;

import eu.hermeneut.domain.MyAnswer;

import java.util.List;

/**
 * Service Interface for managing MyAnswer.
 */
public interface MyAnswerService {

    /**
     * Save a myAnswer.
     *
     * @param myAnswer the entity to save
     * @return the persisted entity
     */
    MyAnswer save(MyAnswer myAnswer);


    List<MyAnswer> saveAll(List<MyAnswer> myAnswers);

    /**
     * Get all the myAnswers.
     *
     * @return the list of entities
     */
    List<MyAnswer> findAll();

    /**
     * Get all the myAnswers by questionnaire and user
     *
     * @param questionnaireID the id of the questionnaire
     * @param userID          the id of the user
     * @return the myAnswers of the user on the questionnaire
     */
    List<MyAnswer> findAllByQuestionnaireAndUser(Long questionnaireID, Long userID);

    /**
     * Get the "id" myAnswer.
     *
     * @param id the id of the entity
     * @return the entity
     */
    MyAnswer findOne(Long id);

    /**
     * Delete the "id" myAnswer.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the myAnswer corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    List<MyAnswer> search(String query);

    List<MyAnswer> findAllByQuestionnaireStatus(Long questionnaireStatusID);
}
