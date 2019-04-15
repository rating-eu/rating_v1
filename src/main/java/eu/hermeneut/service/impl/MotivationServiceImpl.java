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

import eu.hermeneut.service.MotivationService;
import eu.hermeneut.domain.Motivation;
import eu.hermeneut.repository.MotivationRepository;
import eu.hermeneut.repository.search.MotivationSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Motivation.
 */
@Service
@Transactional
public class MotivationServiceImpl implements MotivationService {

    private final Logger log = LoggerFactory.getLogger(MotivationServiceImpl.class);

    private final MotivationRepository motivationRepository;

    private final MotivationSearchRepository motivationSearchRepository;

    public MotivationServiceImpl(MotivationRepository motivationRepository, MotivationSearchRepository motivationSearchRepository) {
        this.motivationRepository = motivationRepository;
        this.motivationSearchRepository = motivationSearchRepository;
    }

    /**
     * Save a motivation.
     *
     * @param motivation the entity to save
     * @return the persisted entity
     */
    @Override
    public Motivation save(Motivation motivation) {
        log.debug("Request to save Motivation : {}", motivation);
        Motivation result = motivationRepository.save(motivation);
        motivationSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the motivations.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Motivation> findAll() {
        log.debug("Request to get all Motivations");
        return motivationRepository.findAll();
    }

    /**
     * Get one motivation by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Motivation findOne(Long id) {
        log.debug("Request to get Motivation : {}", id);
        return motivationRepository.findOne(id);
    }

    /**
     * Delete the motivation by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Motivation : {}", id);
        motivationRepository.delete(id);
        motivationSearchRepository.delete(id);
    }

    /**
     * Search for the motivation corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Motivation> search(String query) {
        log.debug("Request to search Motivations for query {}", query);
        return StreamSupport
            .stream(motivationSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
