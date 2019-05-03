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

import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;

import java.util.BitSet;
import java.util.List;

/**
 * Service Interface for managing QuestionnaireStatus.
 */
public interface QuestionnaireStatusService {

    /**
     * Save a questionnaireStatus.
     *
     * @param questionnaireStatus the entity to save
     * @return the persisted entity
     */
    QuestionnaireStatus save(QuestionnaireStatus questionnaireStatus);

    /**
     * Get all the questionnaireStatuses.
     *
     * @return the list of entities
     */
    List<QuestionnaireStatus> findAll();

    /**
     * Get the "id" questionnaireStatus.
     *
     * @param id the id of the entity
     * @return the entity
     */
    QuestionnaireStatus findOne(Long id);

    /**
     * Delete the "id" questionnaireStatus.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the questionnaireStatus corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    List<QuestionnaireStatus> search(String query);

    /*List<QuestionnaireStatus> findAllBySelfAssessmentAndUser(Long selfAssessmentID, Long userID);

    QuestionnaireStatus findByRoleSelfAssessmentAndQuestionnaire(String role, Long selfAssessmentID, Long questionnaireID);

    List<QuestionnaireStatus> findAllBySelfAssessment(Long selfAssessmentID);

    List<QuestionnaireStatus> findAllBySelfAssessmentAndQuestionnairePurpose(Long selfAssessmentID, QuestionnairePurpose purpose);

    QuestionnaireStatus findBySelfAssessmentRoleAndQuestionnairePurpose(Long selfAssessmentID, Role role, QuestionnairePurpose purpose);*/

    List<QuestionnaireStatus> findAllByCompanyProfileAndUser(Long companyProfileID, Long userID);

    QuestionnaireStatus findByRoleCompanyProfileAndQuestionnaire(Role role, Long companyProfileID, Long questionnaireID);

    List<QuestionnaireStatus> findAllByCompanyProfile(Long companyProfileID);

    List<QuestionnaireStatus> findAllByCompanyProfileAndQuestionnairePurpose(Long companyProfileID, QuestionnairePurpose purpose);

    QuestionnaireStatus findByCompanyProfileRoleAndQuestionnairePurpose(Long companyProfileID, Role role, QuestionnairePurpose purpose);

    List<QuestionnaireStatus> findAllByCompanyProfileQuestionnairePurposeAndUser(Long companyProfileID, QuestionnairePurpose questionnairePurpose, Long userID);
}
