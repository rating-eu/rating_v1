package eu.hermeneut.service.impl;

import eu.hermeneut.service.LikelihoodScaleService;
import eu.hermeneut.domain.LikelihoodScale;
import eu.hermeneut.repository.LikelihoodScaleRepository;
import eu.hermeneut.repository.search.LikelihoodScaleSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing LikelihoodScale.
 */
@Service
@Transactional
public class LikelihoodScaleServiceImpl implements LikelihoodScaleService {

    private final Logger log = LoggerFactory.getLogger(LikelihoodScaleServiceImpl.class);

    private final LikelihoodScaleRepository likelihoodScaleRepository;

    private final LikelihoodScaleSearchRepository likelihoodScaleSearchRepository;

    public LikelihoodScaleServiceImpl(LikelihoodScaleRepository likelihoodScaleRepository, LikelihoodScaleSearchRepository likelihoodScaleSearchRepository) {
        this.likelihoodScaleRepository = likelihoodScaleRepository;
        this.likelihoodScaleSearchRepository = likelihoodScaleSearchRepository;
    }

    /**
     * Save a likelihoodScale.
     *
     * @param likelihoodScale the entity to save
     * @return the persisted entity
     */
    @Override
    public LikelihoodScale save(LikelihoodScale likelihoodScale) {
        log.debug("Request to save LikelihoodScale : {}", likelihoodScale);
        LikelihoodScale result = likelihoodScaleRepository.save(likelihoodScale);
        likelihoodScaleSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the likelihoodScales.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<LikelihoodScale> findAll() {
        log.debug("Request to get all LikelihoodScales");
        return likelihoodScaleRepository.findAll();
    }

    /**
     * Get one likelihoodScale by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public LikelihoodScale findOne(Long id) {
        log.debug("Request to get LikelihoodScale : {}", id);
        return likelihoodScaleRepository.findOne(id);
    }

    /**
     * Delete the likelihoodScale by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete LikelihoodScale : {}", id);
        likelihoodScaleRepository.delete(id);
        likelihoodScaleSearchRepository.delete(id);
    }

    /**
     * Search for the likelihoodScale corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<LikelihoodScale> search(String query) {
        log.debug("Request to search LikelihoodScales for query {}", query);
        return StreamSupport
            .stream(likelihoodScaleSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public List<LikelihoodScale> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all LikelihoodScales by SelfAssessment");
        return likelihoodScaleRepository.findAllBySelfAssessment(selfAssessmentID);
    }
}
