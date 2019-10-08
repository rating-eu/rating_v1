package eu.hermeneut.service.impl;

import eu.hermeneut.service.DataThreatService;
import eu.hermeneut.domain.DataThreat;
import eu.hermeneut.repository.DataThreatRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing DataThreat.
 */
@Service
@Transactional
public class DataThreatServiceImpl implements DataThreatService {

    private final Logger log = LoggerFactory.getLogger(DataThreatServiceImpl.class);

    private final DataThreatRepository dataThreatRepository;

    public DataThreatServiceImpl(DataThreatRepository dataThreatRepository) {
        this.dataThreatRepository = dataThreatRepository;
    }

    /**
     * Save a dataThreat.
     *
     * @param dataThreat the entity to save
     * @return the persisted entity
     */
    @Override
    public DataThreat save(DataThreat dataThreat) {
        log.debug("Request to save DataThreat : {}", dataThreat);
        return dataThreatRepository.save(dataThreat);
    }

    /**
     * Get all the dataThreats.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DataThreat> findAll() {
        log.debug("Request to get all DataThreats");
        return dataThreatRepository.findAll();
    }

    /**
     * Get one dataThreat by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public DataThreat findOne(Long id) {
        log.debug("Request to get DataThreat : {}", id);
        return dataThreatRepository.findOne(id);
    }

    /**
     * Delete the dataThreat by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DataThreat : {}", id);
        dataThreatRepository.delete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DataThreat> findAllByDataOperation(Long operationID) {
        log.debug("Request to get all DataThreats by DataOperation: {}", operationID);
        return this.dataThreatRepository.findAllByDataOperation(operationID);
    }
}
