package eu.hermeneut.service;

import eu.hermeneut.domain.GDPRMyAnswer;
import java.util.List;

/**
 * Service Interface for managing GDPRMyAnswer.
 */
public interface GDPRMyAnswerService {

    /**
     * Save a gDPRMyAnswer.
     *
     * @param gDPRMyAnswer the entity to save
     * @return the persisted entity
     */
    GDPRMyAnswer save(GDPRMyAnswer gDPRMyAnswer);

    /**
     * Get all the gDPRMyAnswers.
     *
     * @return the list of entities
     */
    List<GDPRMyAnswer> findAll();

    /**
     * Get the "id" gDPRMyAnswer.
     *
     * @param id the id of the entity
     * @return the entity
     */
    GDPRMyAnswer findOne(Long id);

    /**
     * Delete the "id" gDPRMyAnswer.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
