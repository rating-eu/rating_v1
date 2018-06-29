package eu.hermeneut.repository;

import eu.hermeneut.domain.QuestionnaireStatus;
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

    @Query("SELECT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID AND questionnaireStatus.user.id = :userID")
    List<QuestionnaireStatus> findAllBySelfAssessmentAndUser(@Param("selfAssessmentID") Long selfAssessmentID, @Param("userID") Long userID);

    @Query("SELECT questionnaireStatus FROM QuestionnaireStatus questionnaireStatus WHERE questionnaireStatus.selfAssessment.id = :selfAssessmentID")
    List<QuestionnaireStatus> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
