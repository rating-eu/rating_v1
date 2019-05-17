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

import eu.hermeneut.service.ImpactLevelDescriptionService;
import eu.hermeneut.domain.ImpactLevelDescription;
import eu.hermeneut.repository.ImpactLevelDescriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing ImpactLevelDescription.
 */
@Service
@Transactional
public class ImpactLevelDescriptionServiceImpl implements ImpactLevelDescriptionService {

    private final Logger log = LoggerFactory.getLogger(ImpactLevelDescriptionServiceImpl.class);

    private final ImpactLevelDescriptionRepository impactLevelDescriptionRepository;

    public ImpactLevelDescriptionServiceImpl(ImpactLevelDescriptionRepository impactLevelDescriptionRepository) {
        this.impactLevelDescriptionRepository = impactLevelDescriptionRepository;
    }

    /**
     * Save a impactLevelDescription.
     *
     * @param impactLevelDescription the entity to save
     * @return the persisted entity
     */
    @Override
    public ImpactLevelDescription save(ImpactLevelDescription impactLevelDescription) {
        log.debug("Request to save ImpactLevelDescription : {}", impactLevelDescription);
        ImpactLevelDescription result = impactLevelDescriptionRepository.save(impactLevelDescription);
        return result;
    }

    /**
     * Get all the impactLevelDescriptions.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<ImpactLevelDescription> findAll() {
        log.debug("Request to get all ImpactLevelDescriptions");
        return impactLevelDescriptionRepository.findAll();
    }

    /**
     * Get one impactLevelDescription by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public ImpactLevelDescription findOne(Long id) {
        log.debug("Request to get ImpactLevelDescription : {}", id);
        return impactLevelDescriptionRepository.findOne(id);
    }

    /**
     * Delete the impactLevelDescription by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ImpactLevelDescription : {}", id);
        impactLevelDescriptionRepository.delete(id);
    }
}
