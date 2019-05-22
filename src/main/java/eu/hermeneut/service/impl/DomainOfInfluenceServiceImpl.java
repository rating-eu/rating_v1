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

import eu.hermeneut.service.DomainOfInfluenceService;
import eu.hermeneut.domain.DomainOfInfluence;
import eu.hermeneut.repository.DomainOfInfluenceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing DomainOfInfluence.
 */
@Service
@Transactional
public class DomainOfInfluenceServiceImpl implements DomainOfInfluenceService {

    private final Logger log = LoggerFactory.getLogger(DomainOfInfluenceServiceImpl.class);

    private final DomainOfInfluenceRepository domainOfInfluenceRepository;

    public DomainOfInfluenceServiceImpl(DomainOfInfluenceRepository domainOfInfluenceRepository) {
        this.domainOfInfluenceRepository = domainOfInfluenceRepository;
    }

    /**
     * Save a domainOfInfluence.
     *
     * @param domainOfInfluence the entity to save
     * @return the persisted entity
     */
    @Override
    public DomainOfInfluence save(DomainOfInfluence domainOfInfluence) {
        log.debug("Request to save DomainOfInfluence : {}", domainOfInfluence);
        DomainOfInfluence result = domainOfInfluenceRepository.save(domainOfInfluence);
        return result;
    }

    /**
     * Get all the domainOfInfluences.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DomainOfInfluence> findAll() {
        log.debug("Request to get all DomainOfInfluences");
        return domainOfInfluenceRepository.findAll();
    }

    /**
     * Get one domainOfInfluence by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public DomainOfInfluence findOne(Long id) {
        log.debug("Request to get DomainOfInfluence : {}", id);
        return domainOfInfluenceRepository.findOne(id);
    }

    /**
     * Delete the domainOfInfluence by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DomainOfInfluence : {}", id);
        domainOfInfluenceRepository.delete(id);
    }
}
