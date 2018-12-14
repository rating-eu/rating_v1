package eu.hermeneut.service.impl;

import eu.hermeneut.service.LogoService;
import eu.hermeneut.domain.Logo;
import eu.hermeneut.repository.LogoRepository;
import eu.hermeneut.repository.search.LogoSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Logo.
 */
@Service
@Transactional
public class LogoServiceImpl implements LogoService {

    private final Logger log = LoggerFactory.getLogger(LogoServiceImpl.class);

    private final LogoRepository logoRepository;

    private final LogoSearchRepository logoSearchRepository;

    public LogoServiceImpl(LogoRepository logoRepository, LogoSearchRepository logoSearchRepository) {
        this.logoRepository = logoRepository;
        this.logoSearchRepository = logoSearchRepository;
    }

    /**
     * Save a logo.
     *
     * @param logo the entity to save
     * @return the persisted entity
     */
    @Override
    public Logo save(Logo logo) {
        log.debug("Request to save Logo : {}", logo);
        Logo result = logoRepository.save(logo);
        logoSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the logos.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Logo> findAll() {
        log.debug("Request to get all Logos");
        return logoRepository.findAll();
    }

    /**
     * Get one logo by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Logo findOne(Long id) {
        log.debug("Request to get Logo : {}", id);
        return logoRepository.findOne(id);
    }

    /**
     * Delete the logo by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Logo : {}", id);
        logoRepository.delete(id);
        logoSearchRepository.delete(id);
    }

    /**
     * Search for the logo corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Logo> search(String query) {
        log.debug("Request to search Logos for query {}", query);
        return StreamSupport
            .stream(logoSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
