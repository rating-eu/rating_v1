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

import eu.hermeneut.domain.MyAnswer;
import eu.hermeneut.domain.Question;
import eu.hermeneut.domain.Questionnaire;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.enumeration.ContainerType;

import java.util.List;
import java.util.Set;

/**
 * Service Interface for managing MyAnswer.
 */
public interface MyAnswerService {

    /**
     * Save a myAnswer.
     *
     * @param myAnswer the entity to save
     * @return the persisted entity
     */
    MyAnswer save(MyAnswer myAnswer);


    List<MyAnswer> saveAll(List<MyAnswer> myAnswers);

    /**
     * Get all the myAnswers.
     *
     * @return the list of entities
     */
    List<MyAnswer> findAll();

    /**
     * Get all the myAnswers by questionnaire and user
     *
     * @param questionnaireID the id of the questionnaire
     * @param userID          the id of the user
     * @return the myAnswers of the user on the questionnaire
     */
    List<MyAnswer> findAllByQuestionnaireAndUser(Long questionnaireID, Long userID);

    /**
     * Get the "id" myAnswer.
     *
     * @param id the id of the entity
     * @return the entity
     */
    MyAnswer findOne(Long id);

    /**
     * Delete the "id" myAnswer.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    List<MyAnswer> findAllByQuestionnaireStatus(Long questionnaireStatusID);

    List<MyAnswer> findAllByQuestionnaireStatusAndSection(QuestionnaireStatus questionnaireStatus, ContainerType section);
}
