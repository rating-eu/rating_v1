package eu.hermeneut.service.impl;

import eu.hermeneut.domain.enumeration.ConfigKey;
import eu.hermeneut.service.SystemConfigService;
import eu.hermeneut.domain.SystemConfig;
import eu.hermeneut.repository.SystemConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing SystemConfig.
 */
@Service
@Transactional
public class SystemConfigServiceImpl implements SystemConfigService {

    private final Logger log = LoggerFactory.getLogger(SystemConfigServiceImpl.class);

    private final SystemConfigRepository systemConfigRepository;

    public SystemConfigServiceImpl(SystemConfigRepository systemConfigRepository) {
        this.systemConfigRepository = systemConfigRepository;
    }

    /**
     * Save a systemConfig.
     *
     * @param systemConfig the entity to save
     * @return the persisted entity
     */
    @Override
    public SystemConfig save(SystemConfig systemConfig) {
        log.debug("Request to save SystemConfig : {}", systemConfig);
        return systemConfigRepository.save(systemConfig);
    }

    /**
     * Get all the systemConfigs.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SystemConfig> findAll() {
        log.debug("Request to get all SystemConfigs");
        return systemConfigRepository.findAll();
    }

    /**
     * Get one systemConfig by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public SystemConfig findOne(Long id) {
        log.debug("Request to get SystemConfig : {}", id);
        return systemConfigRepository.findOne(id);
    }

    /**
     * Delete the systemConfig by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete SystemConfig : {}", id);
        systemConfigRepository.delete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public SystemConfig findOneByKey(ConfigKey key) {
        log.debug("Request to get SystemConfig : {}", key);
        return systemConfigRepository.findOneByKey(key);
    }
}
