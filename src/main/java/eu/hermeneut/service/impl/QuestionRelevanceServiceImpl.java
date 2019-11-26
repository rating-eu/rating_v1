package eu.hermeneut.service.impl;

import eu.hermeneut.domain.Question;
import eu.hermeneut.domain.Questionnaire;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.service.QuestionRelevanceService;
import eu.hermeneut.domain.QuestionRelevance;
import eu.hermeneut.repository.QuestionRelevanceRepository;
import eu.hermeneut.service.QuestionService;
import eu.hermeneut.service.QuestionnaireStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing QuestionRelevance.
 */
@Service
@Transactional
public class QuestionRelevanceServiceImpl implements QuestionRelevanceService {

    private final Logger log = LoggerFactory.getLogger(QuestionRelevanceServiceImpl.class);

    private final QuestionRelevanceRepository questionRelevanceRepository;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private QuestionService questionService;

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

    @Override
    public List<QuestionRelevance> save(List<QuestionRelevance> questionRelevances) {
        log.debug("Request to save QuestionRelevances");
        return questionRelevanceRepository.save(questionRelevances);
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

    @Override
    public List<QuestionRelevance> findAllByQuestionnaireStatus(Long id) {
        log.debug("Request to get all QuestionRelevances by QuestionnaireStatus");

        QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findOne(id);
        List<QuestionRelevance> relevances = null;

        if (questionnaireStatus != null) {
            Questionnaire questionnaire = questionnaireStatus.getQuestionnaire();

            if (questionnaire != null) {
                if (QuestionnairePurpose.SELFASSESSMENT.equals(questionnaire.getPurpose())) {
                    relevances = this.questionRelevanceRepository.findAllByQuestionnaireStatus(id);

                    if (relevances == null || relevances.isEmpty()) {
                        // Create the default QuestionRelevances.
                        relevances = this.createDefaultRelevances(id);

                        // Save them
                        relevances = this.questionRelevanceRepository.save(relevances);
                    } else {
                        // Check if all the relevances have been found.
                        List<Question> questions = this.questionService.findAllByQuestionnaire(questionnaire);

                        boolean isFull = relevances.size() == questions.size();

                        if (!isFull) {
                            // Create the missing ones

                            Map<Long, Question> questionsMap = questions.stream().parallel()
                                .collect(Collectors.toMap(question -> question.getId(), Function.identity()));

                            Map<Long/*QuestionID*/, QuestionRelevance> relevancesByQuestionIDMap = relevances.stream().parallel()
                                .collect(Collectors.toMap(relevance -> relevance.getQuestion().getId(), Function.identity()));

                            List<Question> missingRelevances = new ArrayList<>();

                            questions.stream().parallel().forEach((question) -> {
                                if (!relevancesByQuestionIDMap.containsKey(question.getId())) {
                                    missingRelevances.add(question);
                                }
                            });

                            relevances.addAll(this.createDefaultRelevances(questionnaireStatus, missingRelevances));

                            // Save them
                            relevances = this.questionRelevanceRepository.save(relevances);
                        }
                    }
                }
            }
        }

        return relevances;
    }

    private List<QuestionRelevance> createDefaultRelevances(Long questionnaireStatusID) {
        QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findOne(questionnaireStatusID);
        List<QuestionRelevance> relevances = new ArrayList<>();

        if (questionnaireStatus != null) {
            Questionnaire questionnaire = questionnaireStatus.getQuestionnaire();

            if (QuestionnairePurpose.SELFASSESSMENT.equals(questionnaire.getPurpose())) {
                List<Question> questions = this.questionService.findAllByQuestionnaire(questionnaire);

                relevances = this.createDefaultRelevances(questionnaireStatus, questions);
            }
        }

        return relevances;
    }

    private List<QuestionRelevance> createDefaultRelevances(QuestionnaireStatus questionnaireStatus, List<Question> questions) {
        List<QuestionRelevance> relevances = new ArrayList<>();

        if (questionnaireStatus != null) {
            questions.forEach((question) -> {
                final QuestionRelevance relevance = new QuestionRelevance();
                relevance.setStatus(questionnaireStatus);
                relevance.setQuestion(question);

                switch (question.getQuestionType()) {
                    case REGULAR: {
                        relevance.setRelevance(1);

                        relevances.add(relevance);
                        break;
                    }
                    case RELEVANT: {
                        relevance.setRelevance(3);

                        relevances.add(relevance);
                        break;
                    }
                    default: {
                        // This should never happen since all the Questions of the SelfAssessment questionnaire are REGULAR or RELEVANT.
                    }
                }
            });
        }

        return relevances;
    }
}
