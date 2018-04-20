package eu.hermeneut.service;

import eu.hermeneut.domain.Questionnaire;
import eu.hermeneut.domain.enumeration.Q_Scope;

import java.util.List;

/**
 * Service Interface for managing Questionnaire.
 */
public interface QuestionnaireService {

    /**
     * Save a questionnaire.
     *
     * @param questionnaire the entity to save
     * @return the persisted entity
     */
    Questionnaire save(Questionnaire questionnaire);

    /**
     * Get all the questionnaires.
     *
     * @return the list of entities
     */
    List<Questionnaire> findAll();
    /**
     * Get all the QuestionnaireDTO where Myanswer is null.
     *
     * @return the list of entities
     *
     */
    /**
     * Get all the questionnaires with a given scope.
     *
     * @return the list of entities
     */
    List<Questionnaire> findAllByScope(Q_Scope scope);

    List<Questionnaire> findAllWhereMyanswerIsNull();

    /**
     * Get the "id" questionnaire.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Questionnaire findOne(Long id);

    /**
     * Delete the "id" questionnaire.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the questionnaire corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<Questionnaire> search(String query);
}
