package eu.hermeneut.service;

import eu.hermeneut.domain.GDPRQuestionnaireStatus;
import java.util.List;

/**
 * Service Interface for managing GDPRQuestionnaireStatus.
 */
public interface GDPRQuestionnaireStatusService {

    /**
     * Save a gDPRQuestionnaireStatus.
     *
     * @param gDPRQuestionnaireStatus the entity to save
     * @return the persisted entity
     */
    GDPRQuestionnaireStatus save(GDPRQuestionnaireStatus gDPRQuestionnaireStatus);

    /**
     * Get all the gDPRQuestionnaireStatuses.
     *
     * @return the list of entities
     */
    List<GDPRQuestionnaireStatus> findAll();

    /**
     * Get the "id" gDPRQuestionnaireStatus.
     *
     * @param id the id of the entity
     * @return the entity
     */
    GDPRQuestionnaireStatus findOne(Long id);

    /**
     * Delete the "id" gDPRQuestionnaireStatus.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
