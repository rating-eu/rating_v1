package eu.hermeneut.service.impl;

import eu.hermeneut.service.LevelWrapperService;
import eu.hermeneut.domain.LevelWrapper;
import eu.hermeneut.repository.LevelWrapperRepository;
import eu.hermeneut.repository.search.LevelWrapperSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing LevelWrapper.
 */
@Service
@Transactional
public class LevelWrapperServiceImpl implements LevelWrapperService {

    private final Logger log = LoggerFactory.getLogger(LevelWrapperServiceImpl.class);

    private final LevelWrapperRepository levelWrapperRepository;

    private final LevelWrapperSearchRepository levelWrapperSearchRepository;

    public LevelWrapperServiceImpl(LevelWrapperRepository levelWrapperRepository, LevelWrapperSearchRepository levelWrapperSearchRepository) {
        this.levelWrapperRepository = levelWrapperRepository;
        this.levelWrapperSearchRepository = levelWrapperSearchRepository;
    }

    /**
     * Save a levelWrapper.
     *
     * @param levelWrapper the entity to save
     * @return the persisted entity
     */
    @Override
    public LevelWrapper save(LevelWrapper levelWrapper) {
        log.debug("Request to save LevelWrapper : {}", levelWrapper);
        LevelWrapper result = levelWrapperRepository.save(levelWrapper);
        levelWrapperSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the levelWrappers.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<LevelWrapper> findAll() {
        log.debug("Request to get all LevelWrappers");
        return levelWrapperRepository.findAll();
    }

    /**
     * Get one levelWrapper by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public LevelWrapper findOne(Long id) {
        log.debug("Request to get LevelWrapper : {}", id);
        return levelWrapperRepository.findOne(id);
    }

    /**
     * Delete the levelWrapper by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete LevelWrapper : {}", id);
        levelWrapperRepository.delete(id);
        levelWrapperSearchRepository.delete(id);
    }

    /**
     * Search for the levelWrapper corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<LevelWrapper> search(String query) {
        log.debug("Request to search LevelWrappers for query {}", query);
        return StreamSupport
            .stream(levelWrapperSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
