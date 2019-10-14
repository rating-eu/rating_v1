package eu.hermeneut.service;

import eu.hermeneut.domain.GDPRQuestion;

import java.util.List;

/**
 * Service Interface for managing GDPRQuestion.
 */
public interface GDPRQuestionService {

    /**
     * Save a gDPRQuestion.
     *
     * @param gDPRQuestion the entity to save
     * @return the persisted entity
     */
    GDPRQuestion save(GDPRQuestion gDPRQuestion);

    /**
     * Get all the gDPRQuestions.
     *
     * @return the list of entities
     */
    List<GDPRQuestion> findAll();

    /**
     * Get the "id" gDPRQuestion.
     *
     * @param id the id of the entity
     * @return the entity
     */
    GDPRQuestion findOne(Long id);

    /**
     * Delete the "id" gDPRQuestion.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Get all the gDPRQuestions belonging to the given questionnaire.
     *
     * @param questionnaireID The ID of the Questionnaire.
     * @return the list of entities
     */
    List<GDPRQuestion> findAllByQuestionnaire(Long questionnaireID);
}
