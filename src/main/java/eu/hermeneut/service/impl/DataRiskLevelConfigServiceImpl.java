package eu.hermeneut.service.impl;

import eu.hermeneut.domain.DataOperation;
import eu.hermeneut.domain.enumeration.DataImpact;
import eu.hermeneut.domain.enumeration.DataRiskLevel;
import eu.hermeneut.domain.enumeration.DataThreatLikelihood;
import eu.hermeneut.service.DataOperationService;
import eu.hermeneut.service.DataRiskLevelConfigService;
import eu.hermeneut.domain.DataRiskLevelConfig;
import eu.hermeneut.repository.DataRiskLevelConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service Implementation for managing DataRiskLevelConfig.
 */
@Service
@Transactional
public class DataRiskLevelConfigServiceImpl implements DataRiskLevelConfigService {

    private static Map<DataThreatLikelihood, Map<DataImpact, DataRiskLevel>> dataRisksMap;

    static {
        dataRisksMap = new HashMap<DataThreatLikelihood, Map<DataImpact, DataRiskLevel>>() {
            {
                put(DataThreatLikelihood.LOW, new HashMap<DataImpact, DataRiskLevel>() {
                    {
                        put(DataImpact.LOW, DataRiskLevel.LOW);
                        put(DataImpact.MEDIUM, DataRiskLevel.MEDIUM);
                        put(DataImpact.HIGH, DataRiskLevel.HIGH);
                        put(DataImpact.VERY_HIGH, DataRiskLevel.HIGH);
                    }
                });

                put(DataThreatLikelihood.MEDIUM, new HashMap<DataImpact, DataRiskLevel>() {
                    {
                        put(DataImpact.LOW, DataRiskLevel.LOW);
                        put(DataImpact.MEDIUM, DataRiskLevel.MEDIUM);
                        put(DataImpact.HIGH, DataRiskLevel.HIGH);
                        put(DataImpact.VERY_HIGH, DataRiskLevel.HIGH);
                    }
                });

                put(DataThreatLikelihood.HIGH, new HashMap<DataImpact, DataRiskLevel>() {
                    {
                        put(DataImpact.LOW, DataRiskLevel.MEDIUM);
                        put(DataImpact.MEDIUM, DataRiskLevel.HIGH);
                        put(DataImpact.HIGH, DataRiskLevel.HIGH);
                        put(DataImpact.VERY_HIGH, DataRiskLevel.HIGH);
                    }
                });
            }
        };
    }

    private final Logger log = LoggerFactory.getLogger(DataRiskLevelConfigServiceImpl.class);

    private final DataRiskLevelConfigRepository dataRiskLevelConfigRepository;

    @Autowired
    private DataOperationService dataOperationService;

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

    @Override
    public List<DataRiskLevelConfig> save(Collection<DataRiskLevelConfig> dataRiskLevelConfigs) {
        return this.dataRiskLevelConfigRepository.save(dataRiskLevelConfigs);
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

    @Override
    public void delete(List<DataRiskLevelConfig> riskLevelConfigs) {
        log.debug("Request to delete the list of DataRiskLevelConfigs");
        dataRiskLevelConfigRepository.delete(riskLevelConfigs);
    }

    /**
     * Get all the dataRiskLevelConfigs of the given DataOperation.
     *
     * @param operationID The ID of the DataOperation.
     * @return the list of entities
     */
    @Override
    @Transactional
    public List<DataRiskLevelConfig> findAllByDataOperation(Long operationID) {
        List<DataRiskLevelConfig> configs = this.dataRiskLevelConfigRepository.findAllByDataOperation(operationID);

        if (configs == null || configs.isEmpty()) {
            configs = this.createDefaultDataRiskLevelConfigs(operationID);
        }

        return configs;
    }

    @Override
    @Transactional
    public List<DataRiskLevelConfig> createDefaultDataRiskLevelConfigs(Long operationID) {
        List<DataRiskLevelConfig> configs = this.dataRiskLevelConfigRepository.findAllByDataOperation(operationID);

        if (configs == null || configs.isEmpty()) {
            DataOperation operation = this.dataOperationService.findOne(operationID);

            if (operation != null) {
                dataRisksMap.entrySet().forEach(entry -> {
                    DataThreatLikelihood likelihood = entry.getKey();
                    Map<DataImpact, DataRiskLevel> impactsMap = entry.getValue();

                    if (likelihood != null && impactsMap != null && !impactsMap.isEmpty()) {
                        impactsMap.entrySet().forEach(entry2 -> {
                            DataImpact impact = entry2.getKey();
                            DataRiskLevel risk = entry2.getValue();

                            DataRiskLevelConfig config = new DataRiskLevelConfig();
                            config.setOperation(operation);
                            config.setLikelihood(likelihood);
                            config.setImpact(impact);
                            config.setRisk(risk);
                            config.setRationale("Default Configuration.");

                            configs.add(config);
                        });
                    }
                });
            }
        }

        return this.save(configs);
    }
}
