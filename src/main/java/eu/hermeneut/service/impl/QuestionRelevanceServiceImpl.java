package eu.hermeneut.service.impl;

import eu.hermeneut.service.QuestionRelevanceService;
import eu.hermeneut.domain.QuestionRelevance;
import eu.hermeneut.repository.QuestionRelevanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing QuestionRelevance.
 */
@Service
@Transactional
public class QuestionRelevanceServiceImpl implements QuestionRelevanceService {

    private final Logger log = LoggerFactory.getLogger(QuestionRelevanceServiceImpl.class);

    private final QuestionRelevanceRepository questionRelevanceRepository;

    public QuestionRelevanceServiceImpl(QuestionRelevanceRepository questionRelevanceRepository) {
        this.questionRelevanceRepository = questionRelevanceRepository;
    }

    /**
     * Save a questionRelevance.
     *
     * @param questionRelevance the entity to save
     * @return the persisted entity
     */
    @Override
    public QuestionRelevance save(QuestionRelevance questionRelevance) {
        log.debug("Request to save QuestionRelevance : {}", questionRelevance);
        return questionRelevanceRepository.save(questionRelevance);
    }

    /**
     * Get all the questionRelevances.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<QuestionRelevance> findAll() {
        log.debug("Request to get all QuestionRelevances");
        return questionRelevanceRepository.findAll();
    }

    /**
     * Get one questionRelevance by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public QuestionRelevance findOne(Long id) {
        log.debug("Request to get QuestionRelevance : {}", id);
        return questionRelevanceRepository.findOne(id);
    }

    /**
     * Delete the questionRelevance by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete QuestionRelevance : {}", id);
        questionRelevanceRepository.delete(id);
    }
}
