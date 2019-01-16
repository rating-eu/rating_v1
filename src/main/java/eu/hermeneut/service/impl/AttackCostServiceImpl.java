package eu.hermeneut.service.impl;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.repository.AttackCostRepository;
import eu.hermeneut.repository.search.AttackCostSearchRepository;
import eu.hermeneut.service.MyAssetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing AttackCost.
 */
@Service
@Transactional
public class AttackCostServiceImpl implements AttackCostService {

    private final Logger log = LoggerFactory.getLogger(AttackCostServiceImpl.class);

    private final AttackCostRepository attackCostRepository;

    private final AttackCostSearchRepository attackCostSearchRepository;

    @Autowired
    private MyAssetService myAssetService;

    public AttackCostServiceImpl(AttackCostRepository attackCostRepository, AttackCostSearchRepository attackCostSearchRepository) {
        this.attackCostRepository = attackCostRepository;
        this.attackCostSearchRepository = attackCostSearchRepository;
    }

    /**
     * Save a attackCost.
     *
     * @param attackCost the entity to save
     * @return the persisted entity
     */
    @Override
    public AttackCost save(AttackCost attackCost) {
        log.debug("Request to save AttackCost : {}", attackCost);
        AttackCost result = attackCostRepository.save(attackCost);
        attackCostSearchRepository.save(result);
        return result;
    }

    @Override
    public List<AttackCost> save(List<AttackCost> attackCosts) {
        log.debug("Request to save all the AttackCosts : {}", Arrays.toString(attackCosts.toArray()));
        List<AttackCost> result = attackCostRepository.save(attackCosts);
        attackCostSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the attackCosts.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackCost> findAll() {
        log.debug("Request to get all AttackCosts");
        return attackCostRepository.findAll();
    }

    /**
     * Get one attackCost by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public AttackCost findOne(Long id) {
        log.debug("Request to get AttackCost : {}", id);
        return attackCostRepository.findOne(id);
    }

    /**
     * Delete the attackCost by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete AttackCost : {}", id);
        attackCostRepository.delete(id);
        attackCostSearchRepository.delete(id);
    }

    /**
     * Search for the attackCost corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AttackCost> search(String query) {
        log.debug("Request to search AttackCosts for query {}", query);
        return StreamSupport
            .stream(attackCostSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public List<AttackCost> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all AttackCosts by SelfAssessment ID");
        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);
        Set<AttackCost> attackCosts = new HashSet<>();

        myAssets.forEach((myAsset) -> {
            attackCosts.addAll(myAsset.getCosts());
        });

        return attackCosts.stream().collect(Collectors.toList());
    }
}
