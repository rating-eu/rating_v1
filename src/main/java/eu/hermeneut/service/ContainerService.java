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

import eu.hermeneut.domain.Container;
import java.util.List;

/**
 * Service Interface for managing Container.
 */
public interface ContainerService {

    /**
     * Save a container.
     *
     * @param container the entity to save
     * @return the persisted entity
     */
    Container save(Container container);

    /**
     * Get all the containers.
     *
     * @return the list of entities
     */
    List<Container> findAll();

    /**
     * Get the "id" container.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Container findOne(Long id);

    /**
     * Delete the "id" container.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
