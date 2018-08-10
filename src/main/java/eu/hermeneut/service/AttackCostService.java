package eu.hermeneut.service;

import eu.hermeneut.domain.AttackCost;

import java.util.List;

/**
 * Service Interface for managing AttackCost.
 */
public interface AttackCostService {

    /**
     * Save a attackCost.
     *
     * @param attackCost the entity to save
     * @return the persisted entity
     */
    AttackCost save(AttackCost attackCost);

    List<AttackCost> save(List<AttackCost> attackCosts);

    /**
     * Get all the attackCosts.
     *
     * @return the list of entities
     */
    List<AttackCost> findAll();

    /**
     * Get the "id" attackCost.
     *
     * @param id the id of the entity
     * @return the entity
     */
    AttackCost findOne(Long id);

    /**
     * Delete the "id" attackCost.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the attackCost corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    List<AttackCost> search(String query);
}
