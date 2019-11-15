package eu.hermeneut.service.impl;

import eu.hermeneut.service.OverallDataThreatService;
import eu.hermeneut.domain.OverallDataThreat;
import eu.hermeneut.repository.OverallDataThreatRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing OverallDataThreat.
 */
@Service
@Transactional
public class OverallDataThreatServiceImpl implements OverallDataThreatService {

    private final Logger log = LoggerFactory.getLogger(OverallDataThreatServiceImpl.class);

    private final OverallDataThreatRepository overallDataThreatRepository;

    public OverallDataThreatServiceImpl(OverallDataThreatRepository overallDataThreatRepository) {
        this.overallDataThreatRepository = overallDataThreatRepository;
    }

    /**
     * Save a overallDataThreat.
     *
     * @param overallDataThreat the entity to save
     * @return the persisted entity
     */
    @Override
    public OverallDataThreat save(OverallDataThreat overallDataThreat) {
        log.debug("Request to save OverallDataThreat : {}", overallDataThreat);
        return overallDataThreatRepository.save(overallDataThreat);
    }

    /**
     * Get all the overallDataThreats.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<OverallDataThreat> findAll() {
        log.debug("Request to get all OverallDataThreats");
        return overallDataThreatRepository.findAll();
    }

    /**
     * Get one overallDataThreat by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public OverallDataThreat findOne(Long id) {
        log.debug("Request to get OverallDataThreat : {}", id);
        return overallDataThreatRepository.findOne(id);
    }

    /**
     * Delete the overallDataThreat by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete OverallDataThreat : {}", id);
        overallDataThreatRepository.delete(id);
    }

    @Override
    public OverallDataThreat findOneByDataOperation(Long operationID) {
        log.debug("Request to get OverallDataThreat by DataOperation: {}", operationID);

        return this.overallDataThreatRepository.findOneByDataOperation(operationID);
    }

    @Override
    public List<OverallDataThreat> findAllByCompanyProfile(Long companyID) {
        log.debug("Request to get OverallDataThreat by CompanyProfile: {}", companyID);

        return this.overallDataThreatRepository.findAllByCompanyProfile(companyID);
    }
}
