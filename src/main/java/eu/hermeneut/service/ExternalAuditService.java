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

package eu.hermeneut.service;

import eu.hermeneut.domain.ExternalAudit;
import eu.hermeneut.domain.User;

import java.util.List;

/**
 * Service Interface for managing ExternalAudit.
 */
public interface ExternalAuditService {

    /**
     * Save a externalAudit.
     *
     * @param externalAudit the entity to save
     * @return the persisted entity
     */
    ExternalAudit save(ExternalAudit externalAudit);

    /**
     * Get all the externalAudits.
     *
     * @return the list of entities
     */
    List<ExternalAudit> findAll();

    /**
     * Get the "id" externalAudit.
     *
     * @param id the id of the entity
     * @return the entity
     */
    ExternalAudit findOne(Long id);

    /**
     * Delete the "id" externalAudit.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the externalAudit corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    List<ExternalAudit> search(String query);

    /**
     * GET the ExternalAudit for the input user, if present, else null.
     *
     * @param user the user for which to look for an ExternalAudit.
     * @return the ExternalAudit for the input user, if present ì, else null.
     */
    ExternalAudit getByUser(User user);
}
