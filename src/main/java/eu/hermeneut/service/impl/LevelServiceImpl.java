package eu.hermeneut.service.impl;

import eu.hermeneut.service.LevelService;
import eu.hermeneut.domain.Level;
import eu.hermeneut.repository.LevelRepository;
import eu.hermeneut.repository.search.LevelSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Level.
 */
@Service
@Transactional
public class LevelServiceImpl implements LevelService {

    private final Logger log = LoggerFactory.getLogger(LevelServiceImpl.class);

    private final LevelRepository levelRepository;

    private final LevelSearchRepository levelSearchRepository;

    public LevelServiceImpl(LevelRepository levelRepository, LevelSearchRepository levelSearchRepository) {
        this.levelRepository = levelRepository;
        this.levelSearchRepository = levelSearchRepository;
    }

    /**
     * Save a level.
     *
     * @param level the entity to save
     * @return the persisted entity
     */
    @Override
    public Level save(Level level) {
        log.debug("Request to save Level : {}", level);
        Level result = levelRepository.save(level);
        levelSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the levels.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Level> findAll() {
        log.debug("Request to get all Levels");
        return levelRepository.findAll();
    }

    /**
     * Get one level by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Level findOne(Long id) {
        log.debug("Request to get Level : {}", id);
        return levelRepository.findOne(id);
    }

    /**
     * Delete the level by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Level : {}", id);
        levelRepository.delete(id);
        levelSearchRepository.delete(id);
    }

    /**
     * Search for the level corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Level> search(String query) {
        log.debug("Request to search Levels for query {}", query);
        return StreamSupport
            .stream(levelSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
