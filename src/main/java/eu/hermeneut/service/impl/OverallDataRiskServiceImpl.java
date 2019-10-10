package eu.hermeneut.service.impl;

import eu.hermeneut.service.OverallDataRiskService;
import eu.hermeneut.domain.OverallDataRisk;
import eu.hermeneut.repository.OverallDataRiskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing OverallDataRisk.
 */
@Service
@Transactional
public class OverallDataRiskServiceImpl implements OverallDataRiskService {

    private final Logger log = LoggerFactory.getLogger(OverallDataRiskServiceImpl.class);

    private final OverallDataRiskRepository overallDataRiskRepository;

    public OverallDataRiskServiceImpl(OverallDataRiskRepository overallDataRiskRepository) {
        this.overallDataRiskRepository = overallDataRiskRepository;
    }

    /**
     * Save a overallDataRisk.
     *
     * @param overallDataRisk the entity to save
     * @return the persisted entity
     */
    @Override
    public OverallDataRisk save(OverallDataRisk overallDataRisk) {
        log.debug("Request to save OverallDataRisk : {}", overallDataRisk);
        return overallDataRiskRepository.save(overallDataRisk);
    }

    /**
     * Get all the overallDataRisks.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<OverallDataRisk> findAll() {
        log.debug("Request to get all OverallDataRisks");
        return overallDataRiskRepository.findAll();
    }

    /**
     * Get one overallDataRisk by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public OverallDataRisk findOne(Long id) {
        log.debug("Request to get OverallDataRisk : {}", id);
        return overallDataRiskRepository.findOne(id);
    }

    /**
     * Delete the overallDataRisk by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete OverallDataRisk : {}", id);
        overallDataRiskRepository.delete(id);
    }
}
