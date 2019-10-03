package eu.hermeneut.service.impl;

import eu.hermeneut.aop.annotation.gdpr.OverallSecurityImpactHook;
import eu.hermeneut.domain.DataRecipient;
import eu.hermeneut.domain.DataThreat;
import eu.hermeneut.domain.SecurityImpact;
import eu.hermeneut.service.DataOperationService;
import eu.hermeneut.domain.DataOperation;
import eu.hermeneut.repository.DataOperationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Service Implementation for managing DataOperation.
 */
@Service
@Transactional
public class DataOperationServiceImpl implements DataOperationService {

    private final Logger log = LoggerFactory.getLogger(DataOperationServiceImpl.class);

    private final DataOperationRepository dataOperationRepository;

    public DataOperationServiceImpl(DataOperationRepository dataOperationRepository) {
        this.dataOperationRepository = dataOperationRepository;
    }

    /**
     * Save a dataOperation.
     *
     * @param dataOperation the entity to save
     * @return the persisted entity
     */
    @Override
    @OverallSecurityImpactHook
    public DataOperation save(DataOperation dataOperation) {
        log.debug("Request to save DataOperation : {}", dataOperation);

        if (dataOperation != null) {
            Set<DataRecipient> recipients = dataOperation.getRecipients();
            Set<SecurityImpact> impacts = dataOperation.getImpacts();
            Set<DataThreat> threats = dataOperation.getThreats();

            if (recipients != null && !recipients.isEmpty()) {
                recipients.stream().parallel().forEach((dataRecipient) -> {
                    dataRecipient.setOperation(dataOperation);
                });
            }

            if (impacts != null && !impacts.isEmpty()) {
                impacts.stream().parallel().forEach((securityImpact) -> {
                    securityImpact.setOperation(dataOperation);
                });
            }

            if (threats != null && !threats.isEmpty()) {
                threats.stream().parallel().forEach((dataThreat) -> {
                    dataThreat.setOperation(dataOperation);
                });
            }
        }

        return dataOperationRepository.save(dataOperation);
    }

    /**
     * Get all the dataOperations.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DataOperation> findAll() {
        log.debug("Request to get all DataOperations");
        return dataOperationRepository.findAll();
    }

    /**
     * Get one dataOperation by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public DataOperation findOne(Long id) {
        log.debug("Request to get DataOperation : {}", id);
        return dataOperationRepository.findOne(id);
    }

    /**
     * Delete the dataOperation by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DataOperation : {}", id);
        dataOperationRepository.delete(id);
    }

    @Override
    public List<DataOperation> findAllByCompanyProfile(Long companyProfileID) {
        log.debug("Request to get all the DataOperations by COmpanyProfile {}", companyProfileID);

        return this.dataOperationRepository.findAllByCompanyProfile(companyProfileID);
    }

    @Override
    public DataOperation findOneByCompanyProfileAndOperationID(Long companyProfileID, Long operationID) {
        log.debug("Request to get the DataOperation by COmpanyProfile {} and OperationID", companyProfileID, operationID);

        return this.dataOperationRepository.findOneByCompanyProfileAndOperationID(companyProfileID, operationID);
    }
}
