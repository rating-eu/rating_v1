package eu.hermeneut.service;

import eu.hermeneut.domain.QuestionRelevance;

import java.util.List;

/**
 * Service Interface for managing QuestionRelevance.
 */
public interface QuestionRelevanceService {

    /**
     * Save a questionRelevance.
     *
     * @param questionRelevance the entity to save
     * @return the persisted entity
     */
    QuestionRelevance save(QuestionRelevance questionRelevance);

    List<QuestionRelevance> save(List<QuestionRelevance> questionRelevances);

    /**
     * Get all the questionRelevances.
     *
     * @return the list of entities
     */
    List<QuestionRelevance> findAll();

    /**
     * Get the "id" questionRelevance.
     *
     * @param id the id of the entity
     * @return the entity
     */
    QuestionRelevance findOne(Long id);

    /**
     * Delete the "id" questionRelevance.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Get all the questionRelevances by QuestionnaireStatus.
     *
     * @param id The ID of the QuestionnaireStatus.
     * @return the list of entities
     */
    List<QuestionRelevance> findAllByQuestionnaireStatus(Long id);
}