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

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.Level;
import eu.hermeneut.domain.Phase;

import java.util.List;

/**
 * Service Interface for managing AttackStrategy.
 */
public interface AttackStrategyService {

    /**
     * Save a attackStrategy.
     *
     * @param attackStrategy the entity to save
     * @return the persisted entity
     */
    AttackStrategy save(AttackStrategy attackStrategy);

    /**
     * Get all the attackStrategies.
     *
     * @return the list of entities
     */
    List<AttackStrategy> findAll();

    /**
     * Get the "id" attackStrategy.
     *
     * @param id the id of the entity
     * @return the entity
     */
    AttackStrategy findOne(Long id);

    /**
     * Delete the "id" attackStrategy.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    List<AttackStrategy> findAllByLevel(Level level);

    List<AttackStrategy> findAllByPhase(Phase phase);

    List<AttackStrategy> findAllByLevelAndPhase(Level level, Phase phase);

    List<AttackStrategy> findAllByContainer(Long containerID);
}
