package eu.hermeneut.service;

import eu.hermeneut.domain.Translation;
import java.util.List;

/**
 * Service Interface for managing Translation.
 */
public interface TranslationService {

    /**
     * Save a translation.
     *
     * @param translation the entity to save
     * @return the persisted entity
     */
    Translation save(Translation translation);

    /**
     * Get all the translations.
     *
     * @return the list of entities
     */
    List<Translation> findAll();

    /**
     * Get the "id" translation.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Translation findOne(Long id);

    /**
     * Delete the "id" translation.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
