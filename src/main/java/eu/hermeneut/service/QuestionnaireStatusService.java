package eu.hermeneut.service;

import eu.hermeneut.domain.QuestionnaireStatus;
import java.util.List;

/**
 * Service Interface for managing QuestionnaireStatus.
 */
public interface QuestionnaireStatusService {

    /**
     * Save a questionnaireStatus.
     *
     * @param questionnaireStatus the entity to save
     * @return the persisted entity
     */
    QuestionnaireStatus save(QuestionnaireStatus questionnaireStatus);

    /**
     * Get all the questionnaireStatuses.
     *
     * @return the list of entities
     */
    List<QuestionnaireStatus> findAll();

    /**
     * Get the "id" questionnaireStatus.
     *
     * @param id the id of the entity
     * @return the entity
     */
    QuestionnaireStatus findOne(Long id);

    /**
     * Delete the "id" questionnaireStatus.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the questionnaireStatus corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<QuestionnaireStatus> search(String query);
}
