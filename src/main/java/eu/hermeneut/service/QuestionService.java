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

import eu.hermeneut.domain.Question;
import eu.hermeneut.domain.Questionnaire;

import java.util.List;

/**
 * Service Interface for managing Question.
 */
public interface QuestionService {

    /**
     * Save a question.
     *
     * @param question the entity to save
     * @return the persisted entity
     */
    Question save(Question question);

    /**
     * Get all the questions.
     *
     * @return the list of entities
     */
    List<Question> findAll();

    /**
     * Get the "id" question.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Question findOne(Long id);

    /**
     * Delete the "id" question.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the question corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<Question> search(String query);

    /**
     * Get all the questions by questionnaire.
     *
     * @return the list of entities
     */
    List<Question> findAllByQuestionnaire(Questionnaire questionnaire);
}
