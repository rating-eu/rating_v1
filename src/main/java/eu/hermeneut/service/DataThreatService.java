package eu.hermeneut.service;

import eu.hermeneut.domain.DataThreat;

import java.util.List;

/**
 * Service Interface for managing DataThreat.
 */
public interface DataThreatService {

    /**
     * Save a dataThreat.
     *
     * @param dataThreat the entity to save
     * @return the persisted entity
     */
    DataThreat save(DataThreat dataThreat);

    /**
     * Get all the dataThreats.
     *
     * @return the list of entities
     */
    List<DataThreat> findAll();

    /**
     * Get the "id" dataThreat.
     *
     * @param id the id of the entity
     * @return the entity
     */
    DataThreat findOne(Long id);

    /**
     * Delete the "id" dataThreat.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Get all the dataThreats of the given DataOperation.
     *
     * @param operationID The ID of the DataOperation.
     * @return the list of entities
     */
    List<DataThreat> findAllByDataOperation(Long operationID);
}
