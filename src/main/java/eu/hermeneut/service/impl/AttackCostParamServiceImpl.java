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

import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.enumeration.AttackCostParamType;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AttackCostParamService;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.repository.AttackCostParamRepository;
import eu.hermeneut.repository.search.AttackCostParamSearchRepository;
import eu.hermeneut.service.SelfAssessmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing AttackCostParam.
 */
@Service
@Transactional
public class AttackCostParamServiceImpl implements AttackCostParamService {

    public static final int MIN_PROTECTION_COST_PER_CUSTOMER = 10;
    public static final int MAX_PROTECTION_COST_PER_CUSTOMER = 30;
    public static final float MIN_NOTIFICATION_COST_PER_CUSTOMER = 0.5F;
    public static final int MAX_NOTIFICATION_COST_PER_CUSTOMER = 5;
    private final Logger log = LoggerFactory.getLogger(AttackCostParamServiceImpl.class);

    private final AttackCostParamRepository attackCostParamRepository;

    private final AttackCostParamSearchRepository attackCostParamSearchRepository;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

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


    @Override
    @Transactional(readOnly = true)
    public List<AttackCostParam> findAllBySelfAssessment(Long selfAssessmentID) throws NotFoundException {
        log.debug("Request to get all AttackCostParams by SelfAssessment");

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with id: " + selfAssessmentID + " NOT FOUND.");
        }

        List<AttackCostParam> params = attackCostParamRepository.findAllBySelfAssessment(selfAssessmentID);

        Map<AttackCostParamType, AttackCostParam> paramMap = params.stream().collect(Collectors.toMap(
            (param) -> param.getType(),
            Function.identity()
        ));

        if (!paramMap.containsKey(AttackCostParamType.PROTECTION_COST_PER_CUSTOMER)) {
            paramMap.put(AttackCostParamType.PROTECTION_COST_PER_CUSTOMER, new AttackCostParam());
        }

        paramMap.get(AttackCostParamType.PROTECTION_COST_PER_CUSTOMER)
            .type(AttackCostParamType.PROTECTION_COST_PER_CUSTOMER)
            .min(new BigDecimal(MIN_PROTECTION_COST_PER_CUSTOMER))
            .max(new BigDecimal(MAX_PROTECTION_COST_PER_CUSTOMER))
            .selfAssessment(selfAssessment);


        if (!paramMap.containsKey(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER)) {
            paramMap.put(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER, new AttackCostParam());
        }

        paramMap.get(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER)
            .type(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER)
            .min(new BigDecimal(MIN_NOTIFICATION_COST_PER_CUSTOMER))
            .max(new BigDecimal(MAX_NOTIFICATION_COST_PER_CUSTOMER))
            .selfAssessment(selfAssessment);

        return paramMap.values().stream().collect(Collectors.toList());
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
