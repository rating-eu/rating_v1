/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.service.impl;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.repository.AttackCostRepository;
import eu.hermeneut.repository.search.AttackCostSearchRepository;
import eu.hermeneut.service.MyAssetService;
import org.eclipse.collections.impl.block.factory.HashingStrategies;
import org.eclipse.collections.impl.utility.ListIterate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
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
    @Transactional(readOnly = true)
    public List<AttackCost> findAllUniqueTypesBySelfAssessmentWithNulledID(Long selfAssessmentID) {
        log.debug("Request to get all AttackCosts by SelfAssessment ID");
        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);
        List<AttackCost> attackCosts = new ArrayList<>();

        for (MyAsset myAsset : myAssets) {
            attackCosts.addAll(myAsset.getCosts());
        }

        attackCosts = ListIterate.distinct(attackCosts, HashingStrategies.fromFunction(AttackCost::getType));

        attackCosts.stream().forEach((attackCost -> {
            attackCost.setId(null);
        }));

        return attackCosts;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttackCost> findAllBySelfAssessmentAndCostTypeWithDuplicateTypes(Long selfAssessmentID, CostType costType) {
        log.debug("Request to get all AttackCosts by SelfAssessment ID");
        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);
        List<AttackCost> attackCosts = new ArrayList<>();
        for (MyAsset myAsset : myAssets) {
            attackCosts.addAll(myAsset.getCosts());
        }

        return attackCosts.stream().filter((attackCost) -> attackCost.getType().equals(costType)).collect(Collectors.toList());
    }
}
