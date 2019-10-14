package eu.hermeneut.service;

import eu.hermeneut.domain.DataRiskLevelConfig;

import java.util.Collection;
import java.util.List;

/**
 * Service Interface for managing DataRiskLevelConfig.
 */
public interface DataRiskLevelConfigService {

    /**
     * Save a dataRiskLevelConfig.
     *
     * @param dataRiskLevelConfig the entity to save
     * @return the persisted entity
     */
    DataRiskLevelConfig save(DataRiskLevelConfig dataRiskLevelConfig);

    List<DataRiskLevelConfig> save(Collection<DataRiskLevelConfig> dataRiskLevelConfigs);

    /**
     * Get all the dataRiskLevelConfigs.
     *
     * @return the list of entities
     */
    List<DataRiskLevelConfig> findAll();

    /**
     * Get the "id" dataRiskLevelConfig.
     *
     * @param id the id of the entity
     * @return the entity
     */
    DataRiskLevelConfig findOne(Long id);

    /**
     * Delete the "id" dataRiskLevelConfig.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Get all the dataRiskLevelConfigs.
     * @param operationID The ID of the DataOperation
     *
     * @return the list of entities
     */
    List<DataRiskLevelConfig> findAllByDataOperation(Long operationID);

    List<DataRiskLevelConfig> createDefaultDataRiskLevelConfigs(Long operationID);
}
