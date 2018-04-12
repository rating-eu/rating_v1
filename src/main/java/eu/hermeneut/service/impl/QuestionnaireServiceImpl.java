package eu.hermeneut.service.impl;

import eu.hermeneut.domain.enumeration.Q_Scope;
import eu.hermeneut.service.QuestionnaireService;
import eu.hermeneut.domain.Answer;
import eu.hermeneut.domain.Question;
import eu.hermeneut.domain.Questionnaire;
import eu.hermeneut.repository.QuestionnaireRepository;
import eu.hermeneut.repository.search.QuestionnaireSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Questionnaire.
 */
@Service
@Transactional
public class QuestionnaireServiceImpl implements QuestionnaireService {

    private final Logger log = LoggerFactory.getLogger(QuestionnaireServiceImpl.class);

    private final QuestionnaireRepository questionnaireRepository;

    private final QuestionnaireSearchRepository questionnaireSearchRepository;

    public QuestionnaireServiceImpl(QuestionnaireRepository questionnaireRepository, QuestionnaireSearchRepository questionnaireSearchRepository) {
        this.questionnaireRepository = questionnaireRepository;
        this.questionnaireSearchRepository = questionnaireSearchRepository;
    }

    /**
     * Save a questionnaire.
     *
     * @param questionnaire the entity to save
     * @return the persisted entity
     */
    @Override
    public Questionnaire save(Questionnaire questionnaire) {
        log.debug("Request to save Questionnaire : {}", questionnaire);
        Questionnaire result = questionnaireRepository.save(questionnaire);
        questionnaireSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the questionnaires.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Questionnaire> findAll() {
        log.debug("Request to get all Questionnaires");
        return questionnaireRepository.findAll();
    }

    /**
     * Get all the questionnaires with a given scope.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Questionnaire> findAllByScope(Q_Scope scope) {
        log.debug("Request to get all Questionnaires with a given scope");
        return questionnaireRepository.findAllByScope(scope);
    }

    /**
     * Get one questionnaire by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Questionnaire findOne(Long id) {

        log.debug("Request to get Questionnaire : {}", id);

        Questionnaire toReturn = new Questionnaire();
        toReturn = questionnaireRepository.findOne(id);
        Set<Question> questions = toReturn.getQuestions();
        toReturn.setQuestions(questions);

        for (Question question : questions) {

            Set<Answer> aa = question.getAnswers();
            question.setAnswers(aa);
            for (Answer answer : aa) {
//				System.out.println("quest "+ answer.getQuestion()
//				+ "answer "+ answer.getType());
            }
        }


        System.out.println("toReturn " + toReturn.toString());

        return toReturn;
    }

    /**
     * Delete the questionnaire by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Questionnaire : {}", id);
        questionnaireRepository.delete(id);
        questionnaireSearchRepository.delete(id);
    }

    /**
     * Search for the questionnaire corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Questionnaire> search(String query) {
        log.debug("Request to search Questionnaires for query {}", query);
        return StreamSupport
            .stream(questionnaireSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
