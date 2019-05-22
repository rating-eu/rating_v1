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

import eu.hermeneut.service.SplittingValueService;
import eu.hermeneut.domain.SplittingValue;
import eu.hermeneut.repository.SplittingValueRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing SplittingValue.
 */
@Service
@Transactional
public class SplittingValueServiceImpl implements SplittingValueService {

    private final Logger log = LoggerFactory.getLogger(SplittingValueServiceImpl.class);

    private final SplittingValueRepository splittingValueRepository;

    public SplittingValueServiceImpl(SplittingValueRepository splittingValueRepository) {
        this.splittingValueRepository = splittingValueRepository;
    }

    /**
     * Save a splittingValue.
     *
     * @param splittingValue the entity to save
     * @return the persisted entity
     */
    @Override
    public SplittingValue save(SplittingValue splittingValue) {
        log.debug("Request to save SplittingValue : {}", splittingValue);
        SplittingValue result = splittingValueRepository.save(splittingValue);
        return result;
    }

    @Override
    public List<SplittingValue> save(List<SplittingValue> splittingValues) {
        log.debug("Request to save SplittingValues : {}", splittingValues.size());
        List<SplittingValue> result = splittingValueRepository.save(splittingValues);
        return result;
    }

    /**
     * Get all the splittingValues.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SplittingValue> findAll() {
        log.debug("Request to get all SplittingValues");
        return splittingValueRepository.findAll();
    }

    /**
     * Get one splittingValue by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public SplittingValue findOne(Long id) {
        log.debug("Request to get SplittingValue : {}", id);
        return splittingValueRepository.findOne(id);
    }

    /**
     * Delete the splittingValue by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete SplittingValue : {}", id);
        splittingValueRepository.delete(id);
    }

    @Override
    public List<SplittingValue> findAllBySelfAssessmentID(Long selfAssessmentID) {
        log.debug("Request to get all SplittingLosses by SelfAssessment ID: " + selfAssessmentID);
        return splittingValueRepository.findAllBySelfAssessmentID(selfAssessmentID);
    }

    @Override
    public void delete(List<SplittingValue> splittingValues) {
        log.debug("Request to delete SplittingValues : {}", splittingValues);
        splittingValueRepository.delete(splittingValues);
        splittingValueRepository.delete(splittingValues);
    }
}
