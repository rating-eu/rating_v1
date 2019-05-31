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

package eu.hermeneut.repository;

import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the QuestionnaireStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionnaireStatusRepository extends JpaRepository<QuestionnaireStatus, Long> {
    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers LEFT JOIN FETCH questionnaireStatus.refinement WHERE questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.user.id = :userID")
    List<QuestionnaireStatus> findAllByCompanyProfileAndUser(@Param("companyProfileID") Long companyProfileID, @Param("userID") Long userID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers LEFT JOIN FETCH questionnaireStatus.refinement WHERE questionnaireStatus.companyProfile.id = :companyProfileID")
    List<QuestionnaireStatus> findAllByCompanyProfile(@Param("companyProfileID") Long companyProfileID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers LEFT JOIN FETCH questionnaireStatus.refinement WHERE questionnaireStatus.role = :role AND questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.questionnaire.id = :questionnaireID")
    List<QuestionnaireStatus> findAllByRoleCompanyProfileAndQuestionnaire(@Param("role") Role role, @Param("companyProfileID") Long companyProfileID, @Param("questionnaireID") Long questionnaireID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers LEFT JOIN FETCH questionnaireStatus.refinement WHERE questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose")
    List<QuestionnaireStatus> findAllByCompanyProfileAndQuestionnairePurpose(@Param("companyProfileID") Long companyProfileID, @Param("questionnairePurpose") QuestionnairePurpose purpose);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers LEFT JOIN FETCH questionnaireStatus.refinement WHERE questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.role = :role AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose")
    List<QuestionnaireStatus> findAllByCompanyProfileRoleAndQuestionnairePurpose(@Param("companyProfileID") Long companyProfileID, @Param("role") Role role, @Param("questionnairePurpose") QuestionnairePurpose purpose);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers LEFT JOIN FETCH questionnaireStatus.refinement WHERE questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose AND questionnaireStatus.user.id=:userID")
    List<QuestionnaireStatus> findAllByCompanyProfileQuestionnairePurposeAndCISOUser(@Param("companyProfileID") Long companyProfileID, @Param("questionnairePurpose") QuestionnairePurpose questionnairePurpose, @Param("userID") Long userID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers LEFT JOIN FETCH questionnaireStatus.refinement WHERE questionnaireStatus.external.id = :externalID")
    List<QuestionnaireStatus> findAllByExternalAudit(@Param("externalID") Long externalID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers LEFT JOIN FETCH questionnaireStatus.refinement WHERE questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose AND questionnaireStatus.external.id = :externalID")
    List<QuestionnaireStatus> findAllByCompanyProfileQuestionnairePurposeAndExternalUser(@Param("companyProfileID") Long companyProfileID, @Param("questionnairePurpose") QuestionnairePurpose questionnairePurpose, @Param("externalID") Long externalID);
}
