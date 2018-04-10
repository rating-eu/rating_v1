package eu.hermeneut.service.impl;

import eu.hermeneut.service.DomainOfInfluenceService;
import eu.hermeneut.domain.DomainOfInfluence;
import eu.hermeneut.repository.DomainOfInfluenceRepository;
import eu.hermeneut.repository.search.DomainOfInfluenceSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing DomainOfInfluence.
 */
@Service
@Transactional
public class DomainOfInfluenceServiceImpl implements DomainOfInfluenceService {

    private final Logger log = LoggerFactory.getLogger(DomainOfInfluenceServiceImpl.class);

    private final DomainOfInfluenceRepository domainOfInfluenceRepository;

    private final DomainOfInfluenceSearchRepository domainOfInfluenceSearchRepository;

    public DomainOfInfluenceServiceImpl(DomainOfInfluenceRepository domainOfInfluenceRepository, DomainOfInfluenceSearchRepository domainOfInfluenceSearchRepository) {
        this.domainOfInfluenceRepository = domainOfInfluenceRepository;
        this.domainOfInfluenceSearchRepository = domainOfInfluenceSearchRepository;
    }

    /**
     * Save a domainOfInfluence.
     *
     * @param domainOfInfluence the entity to save
     * @return the persisted entity
     */
    @Override
    public DomainOfInfluence save(DomainOfInfluence domainOfInfluence) {
        log.debug("Request to save DomainOfInfluence : {}", domainOfInfluence);
        DomainOfInfluence result = domainOfInfluenceRepository.save(domainOfInfluence);
        domainOfInfluenceSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the domainOfInfluences.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DomainOfInfluence> findAll() {
        log.debug("Request to get all DomainOfInfluences");
        return domainOfInfluenceRepository.findAll();
    }

    /**
     * Get one domainOfInfluence by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public DomainOfInfluence findOne(Long id) {
        log.debug("Request to get DomainOfInfluence : {}", id);
        return domainOfInfluenceRepository.findOne(id);
    }

    /**
     * Delete the domainOfInfluence by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DomainOfInfluence : {}", id);
        domainOfInfluenceRepository.delete(id);
        domainOfInfluenceSearchRepository.delete(id);
    }

    /**
     * Search for the domainOfInfluence corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DomainOfInfluence> search(String query) {
        log.debug("Request to search DomainOfInfluences for query {}", query);
        return StreamSupport
            .stream(domainOfInfluenceSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
