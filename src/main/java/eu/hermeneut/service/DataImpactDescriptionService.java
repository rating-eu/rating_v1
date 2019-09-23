package eu.hermeneut.service;

import eu.hermeneut.domain.DataImpactDescription;
import java.util.List;

/**
 * Service Interface for managing DataImpactDescription.
 */
public interface DataImpactDescriptionService {

    /**
     * Save a dataImpactDescription.
     *
     * @param dataImpactDescription the entity to save
     * @return the persisted entity
     */
    DataImpactDescription save(DataImpactDescription dataImpactDescription);

    /**
     * Get all the dataImpactDescriptions.
     *
     * @return the list of entities
     */
    List<DataImpactDescription> findAll();

    /**
     * Get the "id" dataImpactDescription.
     *
     * @param id the id of the entity
     * @return the entity
     */
    DataImpactDescription findOne(Long id);

    /**
     * Delete the "id" dataImpactDescription.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
