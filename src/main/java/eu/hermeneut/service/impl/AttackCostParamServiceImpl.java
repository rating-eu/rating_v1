package eu.hermeneut.service.impl;

import eu.hermeneut.service.AttackCostParamService;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.repository.AttackCostParamRepository;
import eu.hermeneut.repository.search.AttackCostParamSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing AttackCostParam.
 */
@Service
@Transactional
public class AttackCostParamServiceImpl implements AttackCostParamService {

    private final Logger log = LoggerFactory.getLogger(AttackCostParamServiceImpl.class);

    private final AttackCostParamRepository attackCostParamRepository;

    private final AttackCostParamSearchRepository attackCostParamSearchRepository;

    public AttackCostParamServiceImpl(AttackCostParamRepository attackCostParamRepository, AttackCostParamSearchRepository attackCostParamSearchRepository) {
        this.attackCostParamRepository = attackCostParamRepository;
        this.attackCostParamSearchRepository = attackCostParamSearchRepository;
    }

    /**
     * Save a attackCostParam.
     *
     * @param attackCostParam the entity to save
     * @return the persisted entity
     */
    @Override
    public AttackCostParam save(AttackCostParam attackCostParam) {
        log.debug("Request to save AttackCostParam : {}", attackCostParam);
        AttackCostParam result = attackCostParamRepository.save(attackCostParam);
        attackCostParamSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the attackCostParams.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackCostParam> findAll() {
        log.debug("Request to get all AttackCostParams");
        return attackCostParamRepository.findAll();
    }

    /**
     * Get one attackCostParam by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public AttackCostParam findOne(Long id) {
        log.debug("Request to get AttackCostParam : {}", id);
        return attackCostParamRepository.findOne(id);
    }

    /**
     * Delete the attackCostParam by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete AttackCostParam : {}", id);
        attackCostParamRepository.delete(id);
        attackCostParamSearchRepository.delete(id);
    }

    /**
     * Search for the attackCostParam corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackCostParam> search(String query) {
        log.debug("Request to search AttackCostParams for query {}", query);
        return StreamSupport
            .stream(attackCostParamSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
