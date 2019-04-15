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

import eu.hermeneut.service.EBITService;
import eu.hermeneut.domain.EBIT;
import eu.hermeneut.repository.EBITRepository;
import eu.hermeneut.repository.search.EBITSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing EBIT.
 */
@Service
@Transactional
public class EBITServiceImpl implements EBITService {

    private final Logger log = LoggerFactory.getLogger(EBITServiceImpl.class);

    private final EBITRepository eBITRepository;

    private final EBITSearchRepository eBITSearchRepository;

    public EBITServiceImpl(EBITRepository eBITRepository, EBITSearchRepository eBITSearchRepository) {
        this.eBITRepository = eBITRepository;
        this.eBITSearchRepository = eBITSearchRepository;
    }

    /**
     * Save a eBIT.
     *
     * @param eBIT the entity to save
     * @return the persisted entity
     */
    @Override
    public EBIT save(EBIT eBIT) {
        log.debug("Request to save EBIT : {}", eBIT);
        EBIT result = eBITRepository.save(eBIT);
        eBITSearchRepository.save(result);
        return result;
    }

    @Override
    public List<EBIT> save(List<EBIT> ebits) {
        log.debug("Request to save EBITs : {}", ebits.size());
        List<EBIT> result = eBITRepository.save(ebits);
        eBITSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the eBITS.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<EBIT> findAll() {
        log.debug("Request to get all EBITS");
        return eBITRepository.findAll();
    }

    /**
     * Get one eBIT by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public EBIT findOne(Long id) {
        log.debug("Request to get EBIT : {}", id);
        return eBITRepository.findOne(id);
    }

    /**
     * Delete the eBIT by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete EBIT : {}", id);
        eBITRepository.delete(id);
        eBITSearchRepository.delete(id);
    }

    @Override
    public void delete(List<EBIT> ebits) {
        log.debug("Request to delete EBITs");
        eBITRepository.delete(ebits);
        eBITSearchRepository.delete(ebits);
    }

    /**
     * Search for the eBIT corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<EBIT> search(String query) {
        log.debug("Request to search EBITS for query {}", query);
        return StreamSupport
            .stream(eBITSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public List<EBIT> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all EBITS");
        return eBITRepository.findAllBySelfAssessment(selfAssessmentID);
    }
}
