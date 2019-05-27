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

import eu.hermeneut.service.LevelService;
import eu.hermeneut.domain.Level;
import eu.hermeneut.repository.LevelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing Level.
 */
@Service
@Transactional
public class LevelServiceImpl implements LevelService {

    private final Logger log = LoggerFactory.getLogger(LevelServiceImpl.class);

    private final LevelRepository levelRepository;

    public LevelServiceImpl(LevelRepository levelRepository) {
        this.levelRepository = levelRepository;
    }

    /**
     * Save a level.
     *
     * @param level the entity to save
     * @return the persisted entity
     */
    @Override
    public Level save(Level level) {
        log.debug("Request to save Level : {}", level);
        Level result = levelRepository.save(level);
        return result;
    }

    /**
     * Get all the levels.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Level> findAll() {
        log.debug("Request to get all Levels");
        return levelRepository.findAll();
    }

    /**
     * Get one level by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Level findOne(Long id) {
        log.debug("Request to get Level : {}", id);
        return levelRepository.findOne(id);
    }

    /**
     * Delete the level by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Level : {}", id);
        levelRepository.delete(id);
    }
}
