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

import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.service.EconomicCoefficientsService;
import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.repository.EconomicCoefficientsRepository;
import eu.hermeneut.repository.search.EconomicCoefficientsSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing EconomicCoefficients.
 */
@Service
@Transactional
public class EconomicCoefficientsServiceImpl implements EconomicCoefficientsService {

    private final Logger log = LoggerFactory.getLogger(EconomicCoefficientsServiceImpl.class);

    private final EconomicCoefficientsRepository economicCoefficientsRepository;

    private final EconomicCoefficientsSearchRepository economicCoefficientsSearchRepository;

    public EconomicCoefficientsServiceImpl(EconomicCoefficientsRepository economicCoefficientsRepository, EconomicCoefficientsSearchRepository economicCoefficientsSearchRepository) {
        this.economicCoefficientsRepository = economicCoefficientsRepository;
        this.economicCoefficientsSearchRepository = economicCoefficientsSearchRepository;
    }

    /**
     * Save a economicCoefficients.
     *
     * @param economicCoefficients the entity to save
     * @return the persisted entity
     */
    @Override
    public EconomicCoefficients save(EconomicCoefficients economicCoefficients) {
        log.debug("Request to save EconomicCoefficients : {}", economicCoefficients);
        EconomicCoefficients result = economicCoefficientsRepository.save(economicCoefficients);
        economicCoefficientsSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the economicCoefficients.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<EconomicCoefficients> findAll() {
        log.debug("Request to get all EconomicCoefficients");
        return economicCoefficientsRepository.findAll();
    }

    /**
     * Get one economicCoefficients by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public EconomicCoefficients findOne(Long id) {
        log.debug("Request to get EconomicCoefficients : {}", id);
        return economicCoefficientsRepository.findOne(id);
    }

    /**
     * Delete the economicCoefficients by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete EconomicCoefficients : {}", id);
        economicCoefficientsRepository.delete(id);
        economicCoefficientsSearchRepository.delete(id);
    }

    /**
     * Search for the economicCoefficients corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<EconomicCoefficients> search(String query) {
        log.debug("Request to search EconomicCoefficients for query {}", query);
        return StreamSupport
            .stream(economicCoefficientsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public EconomicCoefficients findOneBySelfAssessmentID(Long selfAssessmentID) {
        log.debug("Request to get EconomicCoefficients by SelfAssessmentID: {}", selfAssessmentID);
        return economicCoefficientsRepository.findOneBySelfAssessmentID(selfAssessmentID);
    }
}
