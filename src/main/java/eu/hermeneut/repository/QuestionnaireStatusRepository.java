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

    @Query("SELECT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID AND questionnaireStatus.user.id = :userID")
    List<QuestionnaireStatus> findAllBySelfAssessmentAndUser(@Param("selfAssessmentID") Long selfAssessmentID, @Param("userID") Long userID);

    @Query("SELECT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID")
    List<QuestionnaireStatus> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);

    @Query("SELECT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose")
    List<QuestionnaireStatus> findAllBySelfAssessmentAndQuestionnairePurpose(@Param("selfAssessmentID") Long selfAssessmentID, @Param("questionnairePurpose") QuestionnairePurpose questionnairePurpose);

    @Query("SELECT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID AND questionnaireStatus.role = :role AND questionnaireStatus.questionnaire.purpose = :questionnairePurpose")
    QuestionnaireStatus findOneBySelfAssessmentRoleAndQuestionnairePurpose(@Param("selfAssessmentID") Long selfAssessmentID, @Param("role") Role role, @Param("questionnairePurpose") QuestionnairePurpose questionnairePurpose);

    @Query("SELECT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus LEFT JOIN FETCH questionnaireStatus.answers WHERE questionnaireStatus.role = :role AND questionnaireStatus.selfAssessment.id = :selfAssessmentID AND questionnaireStatus.questionnaire.id = :questionnaireID")
    QuestionnaireStatus findByRoleSelfAssessmentAndQuestionnaire(@Param("role") Role role, @Param("selfAssessmentID") Long selfAssessmentID, @Param("questionnaireID") Long questionnaireID);
}
