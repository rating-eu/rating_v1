package eu.hermeneut.service;

import eu.hermeneut.domain.DataRiskLevelConfig;
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
}
