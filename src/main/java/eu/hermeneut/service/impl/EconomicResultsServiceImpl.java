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

import eu.hermeneut.service.EconomicResultsService;
import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.repository.EconomicResultsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing EconomicResults.
 */
@Service
@Transactional
public class EconomicResultsServiceImpl implements EconomicResultsService {

    private final Logger log = LoggerFactory.getLogger(EconomicResultsServiceImpl.class);

    private final EconomicResultsRepository economicResultsRepository;

    public EconomicResultsServiceImpl(EconomicResultsRepository economicResultsRepository) {
        this.economicResultsRepository = economicResultsRepository;
    }

    /**
     * Save a economicResults.
     *
     * @param economicResults the entity to save
     * @return the persisted entity
     */
    @Override
    public EconomicResults save(EconomicResults economicResults) {
        log.debug("Request to save EconomicResults : {}", economicResults);
        EconomicResults result = economicResultsRepository.save(economicResults);
        return result;
    }

    /**
     * Get all the economicResults.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<EconomicResults> findAll() {
        log.debug("Request to get all EconomicResults");
        return economicResultsRepository.findAll();
    }

    /**
     * Get one economicResults by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public EconomicResults findOne(Long id) {
        log.debug("Request to get EconomicResults : {}", id);
        return economicResultsRepository.findOne(id);
    }

    /**
     * Delete the economicResults by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete EconomicResults : {}", id);
        economicResultsRepository.delete(id);
    }

    @Override
    public EconomicResults findOneBySelfAssessmentID(Long selfAssessmentID) {
        log.debug("Request to get EconomicResults by selfAssessmentID: {}", selfAssessmentID);
        return economicResultsRepository.findOneBySelfAssessmentID(selfAssessmentID);
    }
}
