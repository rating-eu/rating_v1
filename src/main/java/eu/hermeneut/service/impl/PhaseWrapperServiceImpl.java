package eu.hermeneut.service.impl;

import eu.hermeneut.service.PhaseWrapperService;
import eu.hermeneut.domain.PhaseWrapper;
import eu.hermeneut.repository.PhaseWrapperRepository;
import eu.hermeneut.repository.search.PhaseWrapperSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing PhaseWrapper.
 */
@Service
@Transactional
public class PhaseWrapperServiceImpl implements PhaseWrapperService {

    private final Logger log = LoggerFactory.getLogger(PhaseWrapperServiceImpl.class);

    private final PhaseWrapperRepository phaseWrapperRepository;

    private final PhaseWrapperSearchRepository phaseWrapperSearchRepository;

    public PhaseWrapperServiceImpl(PhaseWrapperRepository phaseWrapperRepository, PhaseWrapperSearchRepository phaseWrapperSearchRepository) {
        this.phaseWrapperRepository = phaseWrapperRepository;
        this.phaseWrapperSearchRepository = phaseWrapperSearchRepository;
    }

    /**
     * Save a phaseWrapper.
     *
     * @param phaseWrapper the entity to save
     * @return the persisted entity
     */
    @Override
    public PhaseWrapper save(PhaseWrapper phaseWrapper) {
        log.debug("Request to save PhaseWrapper : {}", phaseWrapper);
        PhaseWrapper result = phaseWrapperRepository.save(phaseWrapper);
        phaseWrapperSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the phaseWrappers.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<PhaseWrapper> findAll() {
        log.debug("Request to get all PhaseWrappers");
        return phaseWrapperRepository.findAll();
    }

    /**
     * Get one phaseWrapper by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public PhaseWrapper findOne(Long id) {
        log.debug("Request to get PhaseWrapper : {}", id);
        return phaseWrapperRepository.findOne(id);
    }

    /**
     * Delete the phaseWrapper by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete PhaseWrapper : {}", id);
        phaseWrapperRepository.delete(id);
        phaseWrapperSearchRepository.delete(id);
    }

    /**
     * Search for the phaseWrapper corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<PhaseWrapper> search(String query) {
        log.debug("Request to search PhaseWrappers for query {}", query);
        return StreamSupport
            .stream(phaseWrapperSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
