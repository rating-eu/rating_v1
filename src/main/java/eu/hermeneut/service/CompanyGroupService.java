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

import eu.hermeneut.domain.CompanyGroup;
import java.util.List;

/**
 * Service Interface for managing CompanyGroup.
 */
public interface CompanyGroupService {

    /**
     * Save a companyGroup.
     *
     * @param companyGroup the entity to save
     * @return the persisted entity
     */
    CompanyGroup save(CompanyGroup companyGroup);

    /**
     * Get all the companyGroups.
     *
     * @return the list of entities
     */
    List<CompanyGroup> findAll();

    /**
     * Get the "id" companyGroup.
     *
     * @param id the id of the entity
     * @return the entity
     */
    CompanyGroup findOne(Long id);

    /**
     * Delete the "id" companyGroup.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
