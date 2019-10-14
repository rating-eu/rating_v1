package eu.hermeneut.service;

import eu.hermeneut.domain.DataRecipient;
import java.util.List;

/**
 * Service Interface for managing DataRecipient.
 */
public interface DataRecipientService {

    /**
     * Save a dataRecipient.
     *
     * @param dataRecipient the entity to save
     * @return the persisted entity
     */
    DataRecipient save(DataRecipient dataRecipient);

    /**
     * Get all the dataRecipients.
     *
     * @return the list of entities
     */
    List<DataRecipient> findAll();

    /**
     * Get the "id" dataRecipient.
     *
     * @param id the id of the entity
     * @return the entity
     */
    DataRecipient findOne(Long id);

    /**
     * Delete the "id" dataRecipient.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
