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
    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.user.id = :userID")
    List<QuestionnaireStatus> findAllByCompanyProfileAndUser(@Param("companyProfileID") Long companyProfileID, @Param("userID") Long userID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.companyProfile.id = :companyProfileID")
    List<QuestionnaireStatus> findAllByCompanyProfile(@Param("companyProfileID") Long companyProfileID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.role = :role AND questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.questionnaire.id = :questionnaireID")
    QuestionnaireStatus findAllByRoleCompanyProfileAndQuestionnaire(@Param("role") Role role, @Param("companyProfileID") Long companyProfileID, @Param("questionnaireID") Long questionnaireID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose")
    List<QuestionnaireStatus> findAllByCompanyProfileAndQuestionnairePurpose(@Param("companyProfileID") Long companyProfileID, @Param("questionnairePurpose") QuestionnairePurpose purpose);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.role = :role AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose")
    QuestionnaireStatus findAllByCompanyProfileRoleAndQuestionnairePurpose(@Param("companyProfileID") Long companyProfileID, @Param("role") Role role, @Param("questionnairePurpose") QuestionnairePurpose purpose);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.companyProfile.id = :companyProfileID AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose AND questionnaireStatus.user.id=:userID")
    List<QuestionnaireStatus> findAllByCompanyProfileQuestionnairePurposeAndUser(@Param("companyProfileID") Long companyProfileID, @Param("questionnairePurpose") QuestionnairePurpose questionnairePurpose, @Param("userID") Long userID);

    /*@Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID AND questionnaireStatus.user.id = :userID")
    List<QuestionnaireStatus> findAllBySelfAssessmentAndUser(@Param("selfAssessmentID") Long selfAssessmentID, @Param("userID") Long userID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID")
    List<QuestionnaireStatus> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose")
    List<QuestionnaireStatus> findAllBySelfAssessmentAndQuestionnairePurpose(@Param("selfAssessmentID") Long selfAssessmentID, @Param("questionnairePurpose") QuestionnairePurpose questionnairePurpose);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID AND questionnaireStatus.role = :role AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose")
    QuestionnaireStatus findOneBySelfAssessmentRoleAndQuestionnairePurpose(@Param("selfAssessmentID") Long selfAssessmentID, @Param("role") Role role, @Param("questionnairePurpose") QuestionnairePurpose questionnairePurpose);

    @Query("SELECT DISTINCT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.role = :role AND questionnaireStatus.selfAssessment.id = :selfAssessmentID AND questionnaireStatus.questionnaire.id = :questionnaireID")
    QuestionnaireStatus findByRoleSelfAssessmentAndQuestionnaire(@Param("role") Role role, @Param("selfAssessmentID") Long selfAssessmentID, @Param("questionnaireID") Long questionnaireID);*/
}
