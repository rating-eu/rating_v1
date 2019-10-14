package eu.hermeneut.service.impl;

import eu.hermeneut.service.DataImpactDescriptionService;
import eu.hermeneut.domain.DataImpactDescription;
import eu.hermeneut.repository.DataImpactDescriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing DataImpactDescription.
 */
@Service
@Transactional
public class DataImpactDescriptionServiceImpl implements DataImpactDescriptionService {

    private final Logger log = LoggerFactory.getLogger(DataImpactDescriptionServiceImpl.class);

    private final DataImpactDescriptionRepository dataImpactDescriptionRepository;

    public DataImpactDescriptionServiceImpl(DataImpactDescriptionRepository dataImpactDescriptionRepository) {
        this.dataImpactDescriptionRepository = dataImpactDescriptionRepository;
    }

    /**
     * Save a dataImpactDescription.
     *
     * @param dataImpactDescription the entity to save
     * @return the persisted entity
     */
    @Override
    public DataImpactDescription save(DataImpactDescription dataImpactDescription) {
        log.debug("Request to save DataImpactDescription : {}", dataImpactDescription);
        return dataImpactDescriptionRepository.save(dataImpactDescription);
    }

    /**
     * Get all the dataImpactDescriptions.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DataImpactDescription> findAll() {
        log.debug("Request to get all DataImpactDescriptions");
        return dataImpactDescriptionRepository.findAll();
    }

    /**
     * Get one dataImpactDescription by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public DataImpactDescription findOne(Long id) {
        log.debug("Request to get DataImpactDescription : {}", id);
        return dataImpactDescriptionRepository.findOne(id);
    }

    /**
     * Delete the dataImpactDescription by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DataImpactDescription : {}", id);
        dataImpactDescriptionRepository.delete(id);
    }
}
