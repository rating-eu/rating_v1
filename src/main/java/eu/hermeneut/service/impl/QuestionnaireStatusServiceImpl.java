package eu.hermeneut.service.impl;

import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.service.QuestionnaireStatusService;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.repository.QuestionnaireStatusRepository;
import eu.hermeneut.repository.search.QuestionnaireStatusSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing QuestionnaireStatus.
 */
@Service
@Transactional
public class QuestionnaireStatusServiceImpl implements QuestionnaireStatusService {

    private final Logger log = LoggerFactory.getLogger(QuestionnaireStatusServiceImpl.class);

    private final QuestionnaireStatusRepository questionnaireStatusRepository;

    private final QuestionnaireStatusSearchRepository questionnaireStatusSearchRepository;

    public QuestionnaireStatusServiceImpl(QuestionnaireStatusRepository questionnaireStatusRepository, QuestionnaireStatusSearchRepository questionnaireStatusSearchRepository) {
        this.questionnaireStatusRepository = questionnaireStatusRepository;
        this.questionnaireStatusSearchRepository = questionnaireStatusSearchRepository;
    }

    /**
     * Save a questionnaireStatus.
     *
     * @param questionnaireStatus the entity to save
     * @return the persisted entity
     */
    @Override
    public QuestionnaireStatus save(QuestionnaireStatus questionnaireStatus) {
        log.debug("Request to save QuestionnaireStatus : {}", questionnaireStatus);
        QuestionnaireStatus result = questionnaireStatusRepository.save(questionnaireStatus);
        questionnaireStatusSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the questionnaireStatuses.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<QuestionnaireStatus> findAll() {
        log.debug("Request to get all QuestionnaireStatuses");
        return questionnaireStatusRepository.findAll();
    }

    /**
     * Get one questionnaireStatus by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public QuestionnaireStatus findOne(Long id) {
        log.debug("Request to get QuestionnaireStatus : {}", id);
        return questionnaireStatusRepository.findOne(id);
    }

    /**
     * Delete the questionnaireStatus by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete QuestionnaireStatus : {}", id);
        questionnaireStatusRepository.delete(id);
        questionnaireStatusSearchRepository.delete(id);
    }

    /**
     * Search for the questionnaireStatus corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<QuestionnaireStatus> search(String query) {
        log.debug("Request to search QuestionnaireStatuses for query {}", query);
        return StreamSupport
            .stream(questionnaireStatusSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionnaireStatus> findAllBySelfAssessmentAndUser(Long selfAssessmentID, Long userID) {
        log.debug("Request to get all QuestionnaireStatuses by SelfAssessment");
        return questionnaireStatusRepository.findAllBySelfAssessmentAndUser(selfAssessmentID, userID);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionnaireStatus findByRoleSelfAssessmentAndQuestionnaire(String role, Long selfAssessmentID, Long questionnaireID) {
        log.debug("Request to get all QuestionnaireStatuses by Role, SelfAssessment, and Questionnaire");
        Role roleEnum = Role.valueOf(role);
        return this.questionnaireStatusRepository.findByRoleSelfAssessmentAndQuestionnaire(roleEnum, selfAssessmentID, questionnaireID);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionnaireStatus> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all QuestionnaireStatuses by SelfAssessment and User");
        return questionnaireStatusRepository.findAllBySelfAssessment(selfAssessmentID);
    }
}
