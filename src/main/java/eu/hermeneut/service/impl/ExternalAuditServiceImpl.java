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

import eu.hermeneut.domain.User;
import eu.hermeneut.service.ExternalAuditService;
import eu.hermeneut.domain.ExternalAudit;
import eu.hermeneut.repository.ExternalAuditRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing ExternalAudit.
 */
@Service
@Transactional
public class ExternalAuditServiceImpl implements ExternalAuditService {

    private final Logger log = LoggerFactory.getLogger(ExternalAuditServiceImpl.class);

    private final ExternalAuditRepository externalAuditRepository;

    public ExternalAuditServiceImpl(ExternalAuditRepository externalAuditRepository) {
        this.externalAuditRepository = externalAuditRepository;
    }

    /**
     * Save a externalAudit.
     *
     * @param externalAudit the entity to save
     * @return the persisted entity
     */
    @Override
    public ExternalAudit save(ExternalAudit externalAudit) {
        log.debug("Request to save ExternalAudit : {}", externalAudit);
        ExternalAudit result = externalAuditRepository.save(externalAudit);
        return result;
    }

    /**
     * Get all the externalAudits.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<ExternalAudit> findAll() {
        log.debug("Request to get all ExternalAudits");
        return externalAuditRepository.findAll();
    }

    /**
     * Get one externalAudit by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public ExternalAudit findOne(Long id) {
        log.debug("Request to get ExternalAudit : {}", id);
        return externalAuditRepository.findOne(id);
    }

    /**
     * Delete the externalAudit by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ExternalAudit : {}", id);
        externalAuditRepository.delete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ExternalAudit getByUser(User user) {
        log.debug("Request to get ExternalAudit for user: {}", user.getLogin());
        return externalAuditRepository.findByUser(user);
    }
}
