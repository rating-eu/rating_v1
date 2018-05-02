package eu.hermeneut.service.impl;

import eu.hermeneut.service.AnswerWeightService;
import eu.hermeneut.domain.AnswerWeight;
import eu.hermeneut.repository.AnswerWeightRepository;
import eu.hermeneut.repository.search.AnswerWeightSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing AnswerWeight.
 */
@Service
@Transactional
public class AnswerWeightServiceImpl implements AnswerWeightService {

    private final Logger log = LoggerFactory.getLogger(AnswerWeightServiceImpl.class);

    private final AnswerWeightRepository answerWeightRepository;

    private final AnswerWeightSearchRepository answerWeightSearchRepository;

    public AnswerWeightServiceImpl(AnswerWeightRepository answerWeightRepository, AnswerWeightSearchRepository answerWeightSearchRepository) {
        this.answerWeightRepository = answerWeightRepository;
        this.answerWeightSearchRepository = answerWeightSearchRepository;
    }

    /**
     * Save a answerWeight.
     *
     * @param answerWeight the entity to save
     * @return the persisted entity
     */
    @Override
    public AnswerWeight save(AnswerWeight answerWeight) {
        log.debug("Request to save AnswerWeight : {}", answerWeight);
        AnswerWeight result = answerWeightRepository.save(answerWeight);
        answerWeightSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the answerWeights.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AnswerWeight> findAll() {
        log.debug("Request to get all AnswerWeights");
        return answerWeightRepository.findAll();
    }

    /**
     * Get one answerWeight by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public AnswerWeight findOne(Long id) {
        log.debug("Request to get AnswerWeight : {}", id);
        return answerWeightRepository.findOne(id);
    }

    /**
     * Delete the answerWeight by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete AnswerWeight : {}", id);
        answerWeightRepository.delete(id);
        answerWeightSearchRepository.delete(id);
    }

    /**
     * Search for the answerWeight corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AnswerWeight> search(String query) {
        log.debug("Request to search AnswerWeights for query {}", query);
        return StreamSupport
            .stream(answerWeightSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
