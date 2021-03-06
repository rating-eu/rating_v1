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

import eu.hermeneut.domain.Questionnaire;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;

import java.util.List;

/**
 * Service Interface for managing Questionnaire.
 */
public interface QuestionnaireService {

    /**
     * Save a questionnaire.
     *
     * @param questionnaire the entity to save
     * @return the persisted entity
     */
    Questionnaire save(Questionnaire questionnaire);

    /**
     * Get all the questionnaires.
     *
     * @return the list of entities
     */
    List<Questionnaire> findAll();
    /**
     * Get all the QuestionnaireDTO where Myanswer is null.
     *
     * @return the list of entities
     *
     */
    /**
     * Get all the questionnaires with a given scope.
     *
     * @return the list of entities
     */
    List<Questionnaire> findAllByPurpose(QuestionnairePurpose scope);

    /**
     * Get the "id" questionnaire.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Questionnaire findOne(Long id);

    /**
     * Delete the "id" questionnaire.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the questionnaire corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<Questionnaire> search(String query);
}
