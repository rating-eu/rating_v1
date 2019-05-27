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

import eu.hermeneut.service.ThreatAgentService;
import eu.hermeneut.domain.ThreatAgent;
import eu.hermeneut.repository.ThreatAgentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing ThreatAgent.
 */
@Service
@Transactional
public class ThreatAgentServiceImpl implements ThreatAgentService {

    private final Logger log = LoggerFactory.getLogger(ThreatAgentServiceImpl.class);

    private final ThreatAgentRepository threatAgentRepository;

    public ThreatAgentServiceImpl(ThreatAgentRepository threatAgentRepository) {
        this.threatAgentRepository = threatAgentRepository;
    }

    /**
     * Save a threatAgent.
     *
     * @param threatAgent the entity to save
     * @return the persisted entity
     */
    @Override
    public ThreatAgent save(ThreatAgent threatAgent) {
        log.debug("Request to save ThreatAgent : {}", threatAgent);
        ThreatAgent result = threatAgentRepository.save(threatAgent);
        return result;
    }

    /**
     * Get all the threatAgents.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<ThreatAgent> findAll() {
        log.debug("Request to get all ThreatAgents");
        return threatAgentRepository.findAllWithEagerRelationships();
    }

    /**
     * Get all the default threatAgents.
     *
     * @return the list of entities
     */
    @Override
    public List<ThreatAgent> findAllDefault() {
        log.debug("Request to get all default ThreatAgents");
        return threatAgentRepository.findAllDefault();
    }

    /**
     * Get one threatAgent by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public ThreatAgent findOne(Long id) {
        log.debug("Request to get ThreatAgent : {}", id);
        return threatAgentRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the threatAgent by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ThreatAgent : {}", id);
        threatAgentRepository.delete(id);
    }
}
