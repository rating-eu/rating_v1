package eu.hermeneut.service.impl;

import eu.hermeneut.service.LikelihoodPositionService;
import eu.hermeneut.domain.LikelihoodPosition;
import eu.hermeneut.repository.LikelihoodPositionRepository;
import eu.hermeneut.repository.search.LikelihoodPositionSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing LikelihoodPosition.
 */
@Service
@Transactional
public class LikelihoodPositionServiceImpl implements LikelihoodPositionService {

    private final Logger log = LoggerFactory.getLogger(LikelihoodPositionServiceImpl.class);

    private final LikelihoodPositionRepository likelihoodPositionRepository;

    private final LikelihoodPositionSearchRepository likelihoodPositionSearchRepository;

    public LikelihoodPositionServiceImpl(LikelihoodPositionRepository likelihoodPositionRepository, LikelihoodPositionSearchRepository likelihoodPositionSearchRepository) {
        this.likelihoodPositionRepository = likelihoodPositionRepository;
        this.likelihoodPositionSearchRepository = likelihoodPositionSearchRepository;
    }

    /**
     * Save a likelihoodPosition.
     *
     * @param likelihoodPosition the entity to save
     * @return the persisted entity
     */
    @Override
    public LikelihoodPosition save(LikelihoodPosition likelihoodPosition) {
        log.debug("Request to save LikelihoodPosition : {}", likelihoodPosition);
        LikelihoodPosition result = likelihoodPositionRepository.save(likelihoodPosition);
        likelihoodPositionSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the likelihoodPositions.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<LikelihoodPosition> findAll() {
        log.debug("Request to get all LikelihoodPositions");
        return likelihoodPositionRepository.findAll();
    }

    /**
     * Get one likelihoodPosition by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public LikelihoodPosition findOne(Long id) {
        log.debug("Request to get LikelihoodPosition : {}", id);
        return likelihoodPositionRepository.findOne(id);
    }

    /**
     * Delete the likelihoodPosition by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete LikelihoodPosition : {}", id);
        likelihoodPositionRepository.delete(id);
        likelihoodPositionSearchRepository.delete(id);
    }

    /**
     * Search for the likelihoodPosition corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<LikelihoodPosition> search(String query) {
        log.debug("Request to search LikelihoodPositions for query {}", query);
        return StreamSupport
            .stream(likelihoodPositionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
