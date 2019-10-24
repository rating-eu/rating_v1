package eu.hermeneut.service;

import eu.hermeneut.domain.SystemConfig;
import eu.hermeneut.domain.enumeration.ConfigKey;

import java.util.List;

/**
 * Service Interface for managing SystemConfig.
 */
public interface SystemConfigService {

    /**
     * Save a systemConfig.
     *
     * @param systemConfig the entity to save
     * @return the persisted entity
     */
    SystemConfig save(SystemConfig systemConfig);

    /**
     * Get all the systemConfigs.
     *
     * @return the list of entities
     */
    List<SystemConfig> findAll();

    /**
     * Get the "id" systemConfig.
     *
     * @param id the id of the entity
     * @return the entity
     */
    SystemConfig findOne(Long id);

    /**
     * Delete the "id" systemConfig.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Get the "key" systemConfig.
     *
     * @param key the key of the entity
     * @return the entity
     */
    SystemConfig findOneByKey(ConfigKey key);
}
