package eu.hermeneut.service;

import eu.hermeneut.domain.GDPRAnswer;
import java.util.List;

/**
 * Service Interface for managing GDPRAnswer.
 */
public interface GDPRAnswerService {

    /**
     * Save a gDPRAnswer.
     *
     * @param gDPRAnswer the entity to save
     * @return the persisted entity
     */
    GDPRAnswer save(GDPRAnswer gDPRAnswer);

    /**
     * Get all the gDPRAnswers.
     *
     * @return the list of entities
     */
    List<GDPRAnswer> findAll();

    /**
     * Get the "id" gDPRAnswer.
     *
     * @param id the id of the entity
     * @return the entity
     */
    GDPRAnswer findOne(Long id);

    /**
     * Delete the "id" gDPRAnswer.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
