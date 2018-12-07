package eu.hermeneut.service.impl;

import eu.hermeneut.service.SplittingValueService;
import eu.hermeneut.domain.SplittingValue;
import eu.hermeneut.repository.SplittingValueRepository;
import eu.hermeneut.repository.search.SplittingValueSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing SplittingValue.
 */
@Service
@Transactional
public class SplittingValueServiceImpl implements SplittingValueService {

    private final Logger log = LoggerFactory.getLogger(SplittingValueServiceImpl.class);

    private final SplittingValueRepository splittingValueRepository;

    private final SplittingValueSearchRepository splittingValueSearchRepository;

    public SplittingValueServiceImpl(SplittingValueRepository splittingValueRepository, SplittingValueSearchRepository splittingValueSearchRepository) {
        this.splittingValueRepository = splittingValueRepository;
        this.splittingValueSearchRepository = splittingValueSearchRepository;
    }

    /**
     * Save a splittingValue.
     *
     * @param splittingValue the entity to save
     * @return the persisted entity
     */
    @Override
    public SplittingValue save(SplittingValue splittingValue) {
        log.debug("Request to save SplittingValue : {}", splittingValue);
        SplittingValue result = splittingValueRepository.save(splittingValue);
        splittingValueSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the splittingValues.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SplittingValue> findAll() {
        log.debug("Request to get all SplittingValues");
        return splittingValueRepository.findAll();
    }

    /**
     * Get one splittingValue by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public SplittingValue findOne(Long id) {
        log.debug("Request to get SplittingValue : {}", id);
        return splittingValueRepository.findOne(id);
    }

    /**
     * Delete the splittingValue by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete SplittingValue : {}", id);
        splittingValueRepository.delete(id);
        splittingValueSearchRepository.delete(id);
    }

    /**
     * Search for the splittingValue corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SplittingValue> search(String query) {
        log.debug("Request to search SplittingValues for query {}", query);
        return StreamSupport
            .stream(splittingValueSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
