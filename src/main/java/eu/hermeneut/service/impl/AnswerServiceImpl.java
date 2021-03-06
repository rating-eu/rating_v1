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

import eu.hermeneut.service.AnswerService;
import eu.hermeneut.domain.Answer;
import eu.hermeneut.repository.AnswerRepository;
import eu.hermeneut.repository.search.AnswerSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Answer.
 */
@Service
@Transactional
public class AnswerServiceImpl implements AnswerService {

    private final Logger log = LoggerFactory.getLogger(AnswerServiceImpl.class);

    private final AnswerRepository answerRepository;

    private final AnswerSearchRepository answerSearchRepository;

    public AnswerServiceImpl(AnswerRepository answerRepository, AnswerSearchRepository answerSearchRepository) {
        this.answerRepository = answerRepository;
        this.answerSearchRepository = answerSearchRepository;
    }

    /**
     * Save a answer.
     *
     * @param answer the entity to save
     * @return the persisted entity
     */
    @Override
    public Answer save(Answer answer) {
        log.debug("Request to save Answer : {}", answer);
        Answer result = answerRepository.save(answer);
        answerSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the answers.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Answer> findAll() {
        log.debug("Request to get all Answers");
        return answerRepository.findAll();
    }

    /**
     * Get one answer by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Answer findOne(Long id) {
        log.debug("Request to get Answer : {}", id);
        return answerRepository.findOne(id);
    }

    /**
     * Delete the answer by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Answer : {}", id);
        answerRepository.delete(id);
        answerSearchRepository.delete(id);
    }

    /**
     * Search for the answer corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Answer> search(String query) {
        log.debug("Request to search Answers for query {}", query);
        return StreamSupport
            .stream(answerSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
