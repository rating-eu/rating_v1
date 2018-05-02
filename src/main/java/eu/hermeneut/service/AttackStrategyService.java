package eu.hermeneut.service;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.enumeration.Level;
import eu.hermeneut.domain.enumeration.Phase;

import java.util.List;

/**
 * Service Interface for managing AttackStrategy.
 */
public interface AttackStrategyService {

    /**
     * Save a attackStrategy.
     *
     * @param attackStrategy the entity to save
     * @return the persisted entity
     */
    AttackStrategy save(AttackStrategy attackStrategy);

    /**
     * Get all the attackStrategies.
     *
     * @return the list of entities
     */
    List<AttackStrategy> findAll();

    /**
     * Get the "id" attackStrategy.
     *
     * @param id the id of the entity
     * @return the entity
     */
    AttackStrategy findOne(Long id);

    /**
     * Delete the "id" attackStrategy.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the attackStrategy corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<AttackStrategy> search(String query);

    List<AttackStrategy> findAllByLevel(Level level);

    List<AttackStrategy> findAllByPhase(Phase phase);

    List<AttackStrategy> findAllByLevelAndPhase(Level level, Phase phase);
}
