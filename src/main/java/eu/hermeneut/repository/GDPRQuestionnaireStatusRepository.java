package eu.hermeneut.repository;

import eu.hermeneut.domain.GDPRQuestionnaireStatus;
import eu.hermeneut.domain.enumeration.Role;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the GDPRQuestionnaireStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GDPRQuestionnaireStatusRepository extends JpaRepository<GDPRQuestionnaireStatus, Long> {

    @Query("select gdpr_questionnaire_status from GDPRQuestionnaireStatus gdpr_questionnaire_status where gdpr_questionnaire_status.user.login = ?#{principal.username}")
    List<GDPRQuestionnaireStatus> findByUserIsCurrentUser();

    @Query("SELECT DISTINCT questionnaire_status FROM GDPRQuestionnaireStatus questionnaire_status LEFT JOIN FETCH questionnaire_status.answers WHERE questionnaire_status.operation.id = :operationID AND questionnaire_status.questionnaire.id = :questionnaireID AND questionnaire_status.role = :role")
    GDPRQuestionnaireStatus findOneByDataOperationQuestionnaireAndRole(@Param("operationID") Long operationID, @Param("questionnaireID") Long questionnaireID, @Param("role") Role role);
}
