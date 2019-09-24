package eu.hermeneut.service;

import eu.hermeneut.domain.GDPRQuestionnaire;
import java.util.List;

/**
 * Service Interface for managing GDPRQuestionnaire.
 */
public interface GDPRQuestionnaireService {

    /**
     * Save a gDPRQuestionnaire.
     *
     * @param gDPRQuestionnaire the entity to save
     * @return the persisted entity
     */
    GDPRQuestionnaire save(GDPRQuestionnaire gDPRQuestionnaire);

    /**
     * Get all the gDPRQuestionnaires.
     *
     * @return the list of entities
     */
    List<GDPRQuestionnaire> findAll();

    /**
     * Get the "id" gDPRQuestionnaire.
     *
     * @param id the id of the entity
     * @return the entity
     */
    GDPRQuestionnaire findOne(Long id);

    /**
     * Delete the "id" gDPRQuestionnaire.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
