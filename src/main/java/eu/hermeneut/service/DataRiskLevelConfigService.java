package eu.hermeneut.service;

import eu.hermeneut.domain.DataRiskLevelConfig;

import java.util.Collection;
import java.util.List;

/**
 * Service Interface for managing DataRiskLevelConfig.
 */
public interface DataRiskLevelConfigService {

    DataRiskLevelConfig[][] toMatrix(List<DataRiskLevelConfig> configs);

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
     * Delete the list of the dataRiskLevelConfigs.
     *
     * @param riskLevelConfigs the list of the dataRiskLevelConfigs.
     */
    void delete(List<DataRiskLevelConfig> riskLevelConfigs);

    /**
     * Get all the dataRiskLevelConfigs.
     *
     * @param operationID The ID of the DataOperation
     * @return the list of entities
     */
    List<DataRiskLevelConfig> findAllByDataOperation(Long operationID);

    List<DataRiskLevelConfig> createDefaultDataRiskLevelConfigs(Long operationID);

    /**
     * Validate the given RiskLevel configs.
     *
     * @param configs The list of RiskLevel configs.
     * @return <code>true</code> if they are valid, <code>false</code> otherwise.
     */
    boolean validate(List<DataRiskLevelConfig> configs);
}
