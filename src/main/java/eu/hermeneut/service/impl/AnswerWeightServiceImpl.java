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

import eu.hermeneut.domain.enumeration.QuestionType;
import eu.hermeneut.service.AnswerWeightService;
import eu.hermeneut.domain.AnswerWeight;
import eu.hermeneut.repository.AnswerWeightRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing AnswerWeight.
 */
@Service
@Transactional
public class AnswerWeightServiceImpl implements AnswerWeightService {

    private final Logger log = LoggerFactory.getLogger(AnswerWeightServiceImpl.class);

    private final AnswerWeightRepository answerWeightRepository;


    public AnswerWeightServiceImpl(AnswerWeightRepository answerWeightRepository) {
        this.answerWeightRepository = answerWeightRepository;
    }

    /**
     * Save a answerWeight.
     *
     * @param answerWeight the entity to save
     * @return the persisted entity
     */
    @Override
    public AnswerWeight save(AnswerWeight answerWeight) {
        log.debug("Request to save AnswerWeight : {}", answerWeight);
        AnswerWeight result = answerWeightRepository.save(answerWeight);
        return result;
    }

    /**
     * Get all the allAnswerWeights.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AnswerWeight> findAll() {
        log.debug("Request to get all AnswerWeights");
        return answerWeightRepository.findAll();
    }

    /**
     * Get one answerWeight by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public AnswerWeight findOne(Long id) {
        log.debug("Request to get AnswerWeight : {}", id);
        return answerWeightRepository.findOne(id);
    }

    /**
     * Delete the answerWeight by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete AnswerWeight : {}", id);
        answerWeightRepository.delete(id);
    }

    @Override
    public List<AnswerWeight> findAllByQuestionType(QuestionType questionType) {
        return answerWeightRepository.findAllByQuestionType(questionType);
    }
}
