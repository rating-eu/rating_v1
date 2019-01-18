package eu.hermeneut.service;

import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.exceptions.NotFoundException;

import java.util.List;

/**
 * Service Interface for managing AttackCostParam.
 */
public interface AttackCostParamService {

    /**
     * Save a attackCostParam.
     *
     * @param attackCostParam the entity to save
     * @return the persisted entity
     */
    AttackCostParam save(AttackCostParam attackCostParam);

    /**
     * Get all the attackCostParams.
     *
     * @return the list of entities
     */
    List<AttackCostParam> findAll();

    /**
     * Get the "id" attackCostParam.
     *
     * @param id the id of the entity
     * @return the entity
     */
    AttackCostParam findOne(Long id);

    /**
     * Delete the "id" attackCostParam.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the attackCostParam corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<AttackCostParam> search(String query);

    List<AttackCostParam> findAllBySelfAssessment(Long selfAssessmentID) throws NotFoundException;
}
