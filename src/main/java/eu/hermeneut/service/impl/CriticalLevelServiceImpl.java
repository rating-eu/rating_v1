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

import eu.hermeneut.service.CriticalLevelService;
import eu.hermeneut.domain.CriticalLevel;
import eu.hermeneut.repository.CriticalLevelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing CriticalLevel.
 */
@Service
@Transactional
public class CriticalLevelServiceImpl implements CriticalLevelService {

    private final Logger log = LoggerFactory.getLogger(CriticalLevelServiceImpl.class);

    private final CriticalLevelRepository criticalLevelRepository;

    public CriticalLevelServiceImpl(CriticalLevelRepository criticalLevelRepository) {
        this.criticalLevelRepository = criticalLevelRepository;
    }

    /**
     * Save a criticalLevel.
     *
     * @param criticalLevel the entity to save
     * @return the persisted entity
     */
    @Override
    public CriticalLevel save(CriticalLevel criticalLevel) {
        log.debug("Request to save CriticalLevel : {}", criticalLevel);
        CriticalLevel result = criticalLevelRepository.save(criticalLevel);
        return result;
    }

    /**
     * Get all the criticalLevels.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<CriticalLevel> findAll() {
        log.debug("Request to get all CriticalLevels");
        return criticalLevelRepository.findAll();
    }

    /**
     * Get one criticalLevel by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public CriticalLevel findOne(Long id) {
        log.debug("Request to get CriticalLevel : {}", id);
        return criticalLevelRepository.findOne(id);
    }

    /**
     * Delete the criticalLevel by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete CriticalLevel : {}", id);
        criticalLevelRepository.delete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public CriticalLevel findOneBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get CriticalLevel by SelfAssessment ID: {}", selfAssessmentID);
        return criticalLevelRepository.findOneBySelfAssessment(selfAssessmentID);
    }
}
