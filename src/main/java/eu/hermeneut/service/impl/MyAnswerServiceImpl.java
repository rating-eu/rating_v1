package eu.hermeneut.service.impl;

import eu.hermeneut.service.MyAnswerService;
import eu.hermeneut.domain.MyAnswer;
import eu.hermeneut.repository.MyAnswerRepository;
import eu.hermeneut.repository.search.MyAnswerSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing MyAnswer.
 */
@Service
@Transactional
public class MyAnswerServiceImpl implements MyAnswerService {

    private final Logger log = LoggerFactory.getLogger(MyAnswerServiceImpl.class);

    private final MyAnswerRepository myAnswerRepository;

    private final MyAnswerSearchRepository myAnswerSearchRepository;

    public MyAnswerServiceImpl(MyAnswerRepository myAnswerRepository, MyAnswerSearchRepository myAnswerSearchRepository) {
        this.myAnswerRepository = myAnswerRepository;
        this.myAnswerSearchRepository = myAnswerSearchRepository;
    }

    /**
     * Save a myAnswer.
     *
     * @param myAnswer the entity to save
     * @return the persisted entity
     */
    @Override
    public MyAnswer save(MyAnswer myAnswer) {
        log.debug("Request to save MyAnswer : {}", myAnswer);
        MyAnswer result = myAnswerRepository.save(myAnswer);
        myAnswerSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the myAnswers.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyAnswer> findAll() {
        log.debug("Request to get all MyAnswers");
        return myAnswerRepository.findAll();
    }

    /**
     * Get all the myAnswers by questionnaire and user.
     *
     * @param questionnaireID the id of the questionnaire
     * @param userID          the id of the user
     * @return the answers of the user on that questionnaire.
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyAnswer> findAllByQuestionnaireAndUser(Long questionnaireID, Long userID) {
        log.debug("Request to get all MyAnswers by questionnaire and user");
        return myAnswerRepository.findAllByQuestionnaireAndUser(questionnaireID, userID);
    }

    /**
     * Get one myAnswer by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public MyAnswer findOne(Long id) {
        log.debug("Request to get MyAnswer : {}", id);
        return myAnswerRepository.findOne(id);
    }

    /**
     * Delete the myAnswer by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete MyAnswer : {}", id);
        myAnswerRepository.delete(id);
        myAnswerSearchRepository.delete(id);
    }

    /**
     * Search for the myAnswer corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyAnswer> search(String query) {
        log.debug("Request to search MyAnswers for query {}", query);
        return StreamSupport
            .stream(myAnswerSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    /**
     * Get all the myAnswers by questionnaire status.
     *
     * @param questionnaireStatusID the id of the questionnaire
     * @return the answers by questionnaire status id.
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyAnswer> findAllByQuestionnaireStatus(Long questionnaireStatusID) {
        log.debug("Request to get all MyAnswers by questionnaire and user");
        return myAnswerRepository.findAllByQuestionnaireStatus(questionnaireStatusID);
    }
}
