package eu.hermeneut.service.impl;

import eu.hermeneut.service.OverallSecurityImpactService;
import eu.hermeneut.domain.OverallSecurityImpact;
import eu.hermeneut.repository.OverallSecurityImpactRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing OverallSecurityImpact.
 */
@Service
@Transactional
public class OverallSecurityImpactServiceImpl implements OverallSecurityImpactService {

    private final Logger log = LoggerFactory.getLogger(OverallSecurityImpactServiceImpl.class);

    private final OverallSecurityImpactRepository overallSecurityImpactRepository;

    public OverallSecurityImpactServiceImpl(OverallSecurityImpactRepository overallSecurityImpactRepository) {
        this.overallSecurityImpactRepository = overallSecurityImpactRepository;
    }

    /**
     * Save a overallSecurityImpact.
     *
     * @param overallSecurityImpact the entity to save
     * @return the persisted entity
     */
    @Override
    public OverallSecurityImpact save(OverallSecurityImpact overallSecurityImpact) {
        log.debug("Request to save OverallSecurityImpact : {}", overallSecurityImpact);
        return overallSecurityImpactRepository.save(overallSecurityImpact);
    }

    /**
     * Get all the overallSecurityImpacts.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<OverallSecurityImpact> findAll() {
        log.debug("Request to get all OverallSecurityImpacts");
        return overallSecurityImpactRepository.findAll();
    }

    /**
     * Get one overallSecurityImpact by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public OverallSecurityImpact findOne(Long id) {
        log.debug("Request to get OverallSecurityImpact : {}", id);
        return overallSecurityImpactRepository.findOne(id);
    }

    /**
     * Delete the overallSecurityImpact by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete OverallSecurityImpact : {}", id);
        overallSecurityImpactRepository.delete(id);
    }
}
