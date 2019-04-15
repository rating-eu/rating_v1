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

import eu.hermeneut.domain.AnswerWeight;
import java.util.List;

/**
 * Service Interface for managing AnswerWeight.
 */
public interface AnswerWeightService {

    /**
     * Save a answerWeight.
     *
     * @param answerWeight the entity to save
     * @return the persisted entity
     */
    AnswerWeight save(AnswerWeight answerWeight);

    /**
     * Get all the answerWeights.
     *
     * @return the list of entities
     */
    List<AnswerWeight> findAll();

    /**
     * Get the "id" answerWeight.
     *
     * @param id the id of the entity
     * @return the entity
     */
    AnswerWeight findOne(Long id);

    /**
     * Delete the "id" answerWeight.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the answerWeight corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<AnswerWeight> search(String query);
}
