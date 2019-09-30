package eu.hermeneut.service.impl;

import eu.hermeneut.service.GDPRQuestionService;
import eu.hermeneut.domain.GDPRQuestion;
import eu.hermeneut.repository.GDPRQuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing GDPRQuestion.
 */
@Service
@Transactional
public class GDPRQuestionServiceImpl implements GDPRQuestionService {

    private final Logger log = LoggerFactory.getLogger(GDPRQuestionServiceImpl.class);

    private final GDPRQuestionRepository gDPRQuestionRepository;

    public GDPRQuestionServiceImpl(GDPRQuestionRepository gDPRQuestionRepository) {
        this.gDPRQuestionRepository = gDPRQuestionRepository;
    }

    /**
     * Save a gDPRQuestion.
     *
     * @param gDPRQuestion the entity to save
     * @return the persisted entity
     */
    @Override
    public GDPRQuestion save(GDPRQuestion gDPRQuestion) {
        log.debug("Request to save GDPRQuestion : {}", gDPRQuestion);
        return gDPRQuestionRepository.save(gDPRQuestion);
    }

    /**
     * Get all the gDPRQuestions.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<GDPRQuestion> findAll() {
        log.debug("Request to get all GDPRQuestions");
        return gDPRQuestionRepository.findAllWithEagerRelationships();
    }

    /**
     * Get one gDPRQuestion by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public GDPRQuestion findOne(Long id) {
        log.debug("Request to get GDPRQuestion : {}", id);
        return gDPRQuestionRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the gDPRQuestion by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete GDPRQuestion : {}", id);
        gDPRQuestionRepository.delete(id);
    }

    /**
     * Get all the Questions belonging to the given questionnaire.
     * @param questionnaireID The ID of the Questionnaire.
     * @return The list of questions of the questionnaire.
     */
    @Override
    public List<GDPRQuestion> findAllByQuestionnaire(Long questionnaireID) {
        log.debug("Request to get all GDPRQuestions belonging to the questionnaire: " + questionnaireID);
        return gDPRQuestionRepository.findAllByQuestionnaire(questionnaireID);
    }
}
