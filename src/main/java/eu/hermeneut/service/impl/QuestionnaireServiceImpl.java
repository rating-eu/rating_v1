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

import eu.hermeneut.domain.enumeration.CompanyType;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.service.QuestionnaireService;
import eu.hermeneut.domain.Questionnaire;
import eu.hermeneut.repository.QuestionnaireRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing Questionnaire.
 */
@Service
@Transactional
public class QuestionnaireServiceImpl implements QuestionnaireService {

    private final Logger log = LoggerFactory.getLogger(QuestionnaireServiceImpl.class);

    private final QuestionnaireRepository questionnaireRepository;

    public QuestionnaireServiceImpl(QuestionnaireRepository questionnaireRepository) {
        this.questionnaireRepository = questionnaireRepository;
    }

    /**
     * Get all the questionnaires with a given scope.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Questionnaire findOneByPurpose(QuestionnairePurpose purpose) {
        log.debug("Request to get the Questionnaires with a given purpose");
        return questionnaireRepository.findOneByPurposeAndCompanyType(purpose, CompanyType.OTHER);
    }

    @Override
    public Questionnaire findOneByPurposeAndCompanyType(QuestionnairePurpose purpose, CompanyType companyType) {
        log.debug("Reques to get the questionnaire by purpose and company type.");
        return this.questionnaireRepository.findOneByPurposeAndCompanyType(purpose, companyType);
    }

    /**
     * Save a questionnaire.
     *
     * @param questionnaire the entity to save
     * @return the persisted entity
     */
    @Override
    public Questionnaire save(Questionnaire questionnaire) {
        log.debug("Request to save Questionnaire : {}", questionnaire);
        Questionnaire result = questionnaireRepository.save(questionnaire);
        return result;
    }

    /**
     * Get all the questionnaires.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Questionnaire> findAll() {
        log.debug("Request to get all Questionnaires");
        return questionnaireRepository.findAll();
    }

    /**
     * Get one questionnaire by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Questionnaire findOne(Long id) {
        log.debug("Request to get Questionnaire : {}", id);
        return questionnaireRepository.findOne(id);
    }

    /**
     * Delete the questionnaire by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Questionnaire : {}", id);
        questionnaireRepository.delete(id);
    }
}
