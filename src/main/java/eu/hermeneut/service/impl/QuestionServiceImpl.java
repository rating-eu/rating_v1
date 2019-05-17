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

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.ContainerType;
import eu.hermeneut.service.QuestionService;
import eu.hermeneut.repository.QuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Service Implementation for managing Question.
 */
@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final Logger log = LoggerFactory.getLogger(QuestionServiceImpl.class);

    private final QuestionRepository questionRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    /**
     * Save a question.
     *
     * @param question the entity to save
     * @return the persisted entity
     */
    @Override
    public Question save(Question question) {
        log.debug("Request to save Question : {}", question);
        Question result = questionRepository.save(question);
        return result;
    }

    /**
     * Get all the questions.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Question> findAll() {
        log.debug("Request to get all Questions");
        return questionRepository.findAllWithEagerRelationships();
    }

    /**
     * Get one question by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Question findOne(Long id) {
        log.debug("Request to get Question : {}", id);
        return questionRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the question by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Question : {}", id);
        questionRepository.delete(id);
    }

    @Override
    public List<Question> findAllByQuestionnaire(Questionnaire questionnaire) {
        return this.questionRepository.findAllByQuestionnaire(questionnaire);
    }

    @Override
    public List<Question> findAllByQuestionnaireAndSection(Questionnaire questionnaire, ContainerType section) {

        List<Question> questions = this.questionRepository.findAllByQuestionnaire(questionnaire);

        Stream<Question> stream = questions.stream().parallel().filter(question -> {
            Set<AttackStrategy> attackStrategies = question.getAttackStrategies();
            boolean accepted = false;

            if (attackStrategies != null && !attackStrategies.isEmpty()) {
                for (AttackStrategy attackStrategy : attackStrategies) {
                    Set<Level> levels = attackStrategy.getLevels();

                    if (levels != null && !levels.isEmpty()) {
                        for (Level level : levels) {
                            Container container = level.getContainer();

                            if (container != null) {
                                ContainerType type = container.getContainerType();

                                if (type.equals(section)) {
                                    accepted = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            return accepted;
        });

        List<Question> sectionQuestions = stream.collect(Collectors.toList());

        return sectionQuestions;
    }
}
