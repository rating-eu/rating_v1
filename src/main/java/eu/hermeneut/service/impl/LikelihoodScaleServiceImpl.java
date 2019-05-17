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

import eu.hermeneut.service.LikelihoodScaleService;
import eu.hermeneut.domain.LikelihoodScale;
import eu.hermeneut.repository.LikelihoodScaleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing LikelihoodScale.
 */
@Service
@Transactional
public class LikelihoodScaleServiceImpl implements LikelihoodScaleService {

    private final Logger log = LoggerFactory.getLogger(LikelihoodScaleServiceImpl.class);

    private final LikelihoodScaleRepository likelihoodScaleRepository;

    public LikelihoodScaleServiceImpl(LikelihoodScaleRepository likelihoodScaleRepository) {
        this.likelihoodScaleRepository = likelihoodScaleRepository;
    }

    /**
     * Save a likelihoodScale.
     *
     * @param likelihoodScale the entity to save
     * @return the persisted entity
     */
    @Override
    public LikelihoodScale save(LikelihoodScale likelihoodScale) {
        log.debug("Request to save LikelihoodScale : {}", likelihoodScale);
        LikelihoodScale result = likelihoodScaleRepository.save(likelihoodScale);
        return result;
    }

    /**
     * Get all the likelihoodScales.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<LikelihoodScale> findAll() {
        log.debug("Request to get all LikelihoodScales");
        return likelihoodScaleRepository.findAll();
    }

    /**
     * Get one likelihoodScale by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public LikelihoodScale findOne(Long id) {
        log.debug("Request to get LikelihoodScale : {}", id);
        return likelihoodScaleRepository.findOne(id);
    }

    /**
     * Delete the likelihoodScale by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete LikelihoodScale : {}", id);
        likelihoodScaleRepository.delete(id);
    }

    @Override
    public List<LikelihoodScale> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all LikelihoodScales by SelfAssessment");
        return likelihoodScaleRepository.findAllBySelfAssessment(selfAssessmentID);
    }
}
