package eu.hermeneut.service.impl;

import eu.hermeneut.service.SecurityImpactService;
import eu.hermeneut.domain.SecurityImpact;
import eu.hermeneut.repository.SecurityImpactRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing SecurityImpact.
 */
@Service
@Transactional
public class SecurityImpactServiceImpl implements SecurityImpactService {

    private final Logger log = LoggerFactory.getLogger(SecurityImpactServiceImpl.class);

    private final SecurityImpactRepository securityImpactRepository;

    public SecurityImpactServiceImpl(SecurityImpactRepository securityImpactRepository) {
        this.securityImpactRepository = securityImpactRepository;
    }

    /**
     * Save a securityImpact.
     *
     * @param securityImpact the entity to save
     * @return the persisted entity
     */
    @Override
    public SecurityImpact save(SecurityImpact securityImpact) {
        log.debug("Request to save SecurityImpact : {}", securityImpact);
        return securityImpactRepository.save(securityImpact);
    }

    /**
     * Get all the securityImpacts.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SecurityImpact> findAll() {
        log.debug("Request to get all SecurityImpacts");
        return securityImpactRepository.findAll();
    }

    /**
     * Get one securityImpact by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public SecurityImpact findOne(Long id) {
        log.debug("Request to get SecurityImpact : {}", id);
        return securityImpactRepository.findOne(id);
    }

    /**
     * Delete the securityImpact by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete SecurityImpact : {}", id);
        securityImpactRepository.delete(id);
    }
}
