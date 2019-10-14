package eu.hermeneut.service.impl;

import eu.hermeneut.service.DataRecipientService;
import eu.hermeneut.domain.DataRecipient;
import eu.hermeneut.repository.DataRecipientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing DataRecipient.
 */
@Service
@Transactional
public class DataRecipientServiceImpl implements DataRecipientService {

    private final Logger log = LoggerFactory.getLogger(DataRecipientServiceImpl.class);

    private final DataRecipientRepository dataRecipientRepository;

    public DataRecipientServiceImpl(DataRecipientRepository dataRecipientRepository) {
        this.dataRecipientRepository = dataRecipientRepository;
    }

    /**
     * Save a dataRecipient.
     *
     * @param dataRecipient the entity to save
     * @return the persisted entity
     */
    @Override
    public DataRecipient save(DataRecipient dataRecipient) {
        log.debug("Request to save DataRecipient : {}", dataRecipient);
        return dataRecipientRepository.save(dataRecipient);
    }

    /**
     * Get all the dataRecipients.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DataRecipient> findAll() {
        log.debug("Request to get all DataRecipients");
        return dataRecipientRepository.findAll();
    }

    /**
     * Get one dataRecipient by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public DataRecipient findOne(Long id) {
        log.debug("Request to get DataRecipient : {}", id);
        return dataRecipientRepository.findOne(id);
    }

    /**
     * Delete the dataRecipient by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DataRecipient : {}", id);
        dataRecipientRepository.delete(id);
    }
}
