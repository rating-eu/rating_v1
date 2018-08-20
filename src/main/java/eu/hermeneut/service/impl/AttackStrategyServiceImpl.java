package eu.hermeneut.service.impl;

import eu.hermeneut.domain.Level;
import eu.hermeneut.domain.Phase;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.repository.AttackStrategyRepository;
import eu.hermeneut.repository.search.AttackStrategySearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing AttackStrategy.
 */
@Service
@Transactional
public class AttackStrategyServiceImpl implements AttackStrategyService {

    private final Logger log = LoggerFactory.getLogger(AttackStrategyServiceImpl.class);

    private final AttackStrategyRepository attackStrategyRepository;

    private final AttackStrategySearchRepository attackStrategySearchRepository;

    public AttackStrategyServiceImpl(AttackStrategyRepository attackStrategyRepository, AttackStrategySearchRepository attackStrategySearchRepository) {
        this.attackStrategyRepository = attackStrategyRepository;
        this.attackStrategySearchRepository = attackStrategySearchRepository;
    }

    /**
     * Save a attackStrategy.
     *
     * @param attackStrategy the entity to save
     * @return the persisted entity
     */
    @Override
    public AttackStrategy save(AttackStrategy attackStrategy) {
        log.debug("Request to save AttackStrategy : {}", attackStrategy);
        AttackStrategy result = attackStrategyRepository.save(attackStrategy);
        attackStrategySearchRepository.save(result);
        return result;
    }

    /**
     * Get all the attackStrategies.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackStrategy> findAll() {
        log.debug("Request to get all AttackStrategies");
        return attackStrategyRepository.findAllWithEagerRelationships();
    }

    /**
     * Get one attackStrategy by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public AttackStrategy findOne(Long id) {
        log.debug("Request to get AttackStrategy : {}", id);
        return attackStrategyRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the attackStrategy by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete AttackStrategy : {}", id);
        attackStrategyRepository.delete(id);
        attackStrategySearchRepository.delete(id);
    }

    /**
     * Search for the attackStrategy corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackStrategy> search(String query) {
        log.debug("Request to search AttackStrategies for query {}", query);
        return StreamSupport
            .stream(attackStrategySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    /**
     * Get all the attackStrategies by level.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackStrategy> findAllByLevel(Level level) {
        log.debug("Request to get all AttackStrategies by Level");
        return attackStrategyRepository.findAllByLevel(level.getId());
    }

    /**
     * Get all the attackStrategies by phase.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackStrategy> findAllByPhase(Phase phase) {
        log.debug("Request to get all AttackStrategies by Phase ------------------ SERVICE IMPL");


        return attackStrategyRepository.findAllByPhase(phase.getId());
    }


    /**
     * Get all the attackStrategies by phase and level.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackStrategy> findAllByLevelAndPhase(Level level, Phase phase) {
        log.debug("Request to get all AttackStrategies by level and Phase");


        return attackStrategyRepository.findAllByLevelAndPhase(level.getId(), phase.getId());
    }

    /**
     * Get all the attackStrategies by Container.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackStrategy> findAllByContainer(Long containerID) {
        log.debug("Request to get all AttackStrategies by Container: " + containerID);
        return attackStrategyRepository.findAllByContainer(containerID);
    }
}
