package eu.hermeneut.service.impl;

import eu.hermeneut.service.DataRiskLevelConfigService;
import eu.hermeneut.domain.DataRiskLevelConfig;
import eu.hermeneut.repository.DataRiskLevelConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing DataRiskLevelConfig.
 */
@Service
@Transactional
public class DataRiskLevelConfigServiceImpl implements DataRiskLevelConfigService {

    private final Logger log = LoggerFactory.getLogger(DataRiskLevelConfigServiceImpl.class);

    private final DataRiskLevelConfigRepository dataRiskLevelConfigRepository;

    public DataRiskLevelConfigServiceImpl(DataRiskLevelConfigRepository dataRiskLevelConfigRepository) {
        this.dataRiskLevelConfigRepository = dataRiskLevelConfigRepository;
    }

    /**
     * Save a dataRiskLevelConfig.
     *
     * @param dataRiskLevelConfig the entity to save
     * @return the persisted entity
     */
    @Override
    public DataRiskLevelConfig save(DataRiskLevelConfig dataRiskLevelConfig) {
        log.debug("Request to save DataRiskLevelConfig : {}", dataRiskLevelConfig);
        return dataRiskLevelConfigRepository.save(dataRiskLevelConfig);
    }

    /**
     * Get all the dataRiskLevelConfigs.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DataRiskLevelConfig> findAll() {
        log.debug("Request to get all DataRiskLevelConfigs");
        return dataRiskLevelConfigRepository.findAll();
    }

    /**
     * Get one dataRiskLevelConfig by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public DataRiskLevelConfig findOne(Long id) {
        log.debug("Request to get DataRiskLevelConfig : {}", id);
        return dataRiskLevelConfigRepository.findOne(id);
    }

    /**
     * Delete the dataRiskLevelConfig by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DataRiskLevelConfig : {}", id);
        dataRiskLevelConfigRepository.delete(id);
    }
}
